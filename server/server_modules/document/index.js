const users = require('app/users');
const changelog = require('app/changelog');
const es = require('app/elastic_search');
const checkEmptyFields = require('app/utilities/checkEmptyFields');
const {decryptDocuments, encryptDocument} = require('app/encryption/authentication/documentEncryption');
const {decryptMasterPassword} = require('app/encryption/keys/cryptMasterPassword');
const expect = require('@edgeguideab/expect');
const logger = require('app/logger');

module.exports = {
  search,
  create,
  update,
  delete: deleteDocument,
  checkTitle,
  get,
  getAttachment
};

async function getAttachment(req, res) {
  let id = req.params.id;
  let attachmentIndex = req.params.attachmentIndex;
  let organization = req.session.organization;
  let attachment;

  try {
    attachment = await es.getAttachment({
      documentId: id,
      attachmentIndex,
      organization
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  res.send(attachment);
}

async function get(req, res) {
  let organization = req.session.organization;
  let email = req.session.email;
  let privateKey = req.session.privateKey;
  let id = req.params.id;
  let expectations = expect({
    id: 'string'
  }, {
    id: id
  });

  if (!expectations.wereMet()) {
    return res.status(400).send(expectations.errors());
  }

  let response;
  try {
    response = await es.getDocument({
      organization,
      documentId: id
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    logger.log('silly', `Cannot find user ${email}`);
    return res.status(404).send();
  }
  response._source.encrypted_texts = response._source.encrypted_texts || [];
  response._source.attachments = response._source.attachments || [];
  try {
    response._source.encrypted_texts = await decryptDocuments(response._source.encrypted_texts, privateKey, encryptedMasterPassword);
  } catch (error) {
    logger.log('error', `Decrypt error, could not decrypt with privatekey from user ${email}`);
    return res.status(500).send({msg: 'Internal Server Error'});
  }

  res.send(response);
}

async function checkTitle(req, res) {
  let searchString = req.query.searchString;
  let organization = req.session.organization;

  let expectations = expect({
    searchString: {
      type: 'string',
      allowNull: true
    }
  }, {
    searchString
  });

  if (!expectations.wereMet()) {
    return res.status(400).send(expectations.errors());
  }

  let response;
  try {
    response = await es.searchForDuplicates({
      organization: organization.toLowerCase(),
      searchString: searchString
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send({
      msg: 'internalServerError'
    });
  }
  res.send(response);
}

async function search(req, res) {
  let searchString = req.query.searchString;
  let organization = req.session.organization;
  let results = req.query.results;
  let index = req.query.index;
  let response;
  try {
    response = await es.paginationSearch({
      searchString,
      organization,
      index
    }, results);
  } catch (error) {
    logger.log('error', `ElaticSearch error, probably malformed search query or server is down. \n ${error}`);
    return res.status(500).send();
  }

  res.send({
    searchResult: response.hits.hits,
    totalHits: response.hits.total
  });
}

async function create(req, res) {
  let privateKey = req.session.privateKey;
  let organization = req.session.organization;
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(req.session.email)).password;
  } catch (error) {
    return res.status(404).send();
  }

  let fields = checkEmptyFields(req.body);
  if (!fields.valid) return res.status(400).send({emptyFields: fields.emptyFields, reason: fields.reason});
  let encryptedTexts;
  try {
    encryptedTexts = await encryptDocument(req.body.encryptedTexts, privateKey, encryptedMasterPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  let query = {
    title: req.body.title,
    encryptedTexts: encryptedTexts,
    texts: req.body.texts,
    tags: req.body.tags,
    attachments: req.body.attachments
  };
  let response;
  try {
    response = await es.addToIndex({query, organization});
    res.send(response);
    logger.log('info', `User ${req.session.email} created a document with title ${req.body.title} and id ${response._id}`);
  } catch (error) {
    logger.log('error', `Could not add document to index ${req.body.index}`);
    return res.status(500).send(error);
  }

  try {
    await changelog.addLogEntry(response._id, req.session.email);
    logger.log('info', `Changelog entry for document ${req.body.title} with id ${response._id}`);
  } catch (error) {
    logger.log('error', `Could not add changelog entry to for document ${response._id}`);
    return res.status(500).send(error);
  }
}

async function update(req, res) {
  let email = req.session.email;
  let privateKey = req.session.privateKey;
  let organization = req.session.organization;

  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    console.error(error);
    return res.status(404).send();
  }
  let fields = checkEmptyFields(req.body);
  if (!fields.valid) return res.status(400).send({emptyFields: fields.emptyFields, reason: fields.reason});

  let encryptedTexts;
  try {
    encryptedTexts = await encryptDocument(req.body.encryptedTexts, privateKey, encryptedMasterPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }

  let query = {
    type: req.body.type,
    id: req.params.id,
    refresh: true,
    title: req.body.title,
    encryptedTexts: encryptedTexts,
    texts: req.body.texts,
    tags: req.body.tags,
    attachments: req.body.attachments
  };

  let response;
  try {
    response = await es.update({query, organization});
    logger.log('info', `User ${email} updated document ${req.body.id}`);
  } catch (error) {
    logger.log('error', `Cannot update document ${req.body.id}`);
    return res.status(500).send({msg: 'Internal Server Error'});
  }

  try {
    await changelog.addLogEntry(req.params.id, email);
    res.send(response);
    logger.log('info', `Added changelog entry for ${email}'s update of document ${req.params.id}`);
  } catch (error) {
    logger.log('error', `Could not add log entry for update on document ${req.params.id}`);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
}

async function deleteDocument(req,res) {
  let response;
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(req.session.email)).password;
    decryptMasterPassword(req.session.privateKey, encryptedMasterPassword);
    logger.log('silly', `Successfully authenticated user ${req.session.email} for deleting document ${req.params.id}`);
  } catch (error) {
    logger.log('error', `User ${req.session.email} tried to delete ${req.params.id} without proper authentication`);
    res.status(409).send();
  }

  let query = {
    index: req.session.organization.toLowerCase(),
    id: req.params.id,
    type: req.query.type
  };

  let expectations = expect({
    index: 'string',
    type: 'string',
    id: 'string'
  }, query);

  if (!expectations.wereMet()) {
    res.status(400).send(expectations.errors());
  } else {
    try {
      response = await es.deleteDocument(query);
      res.send(response);
      logger.log('info', `User ${req.session.email} deleted document ${req.params.id}`);
    } catch (error) {
      logger.log('error', 'Cannot delete document!');
      res.status(500).send();
    }
  }
}
