const users = require('app/users');
const es = require('app/elastic_search');
const {decryptDocuments} = require('app/encryption/authentication/documentEncryption');
const checkEmptyFields = require('app/utilities/checkEmptyFields');
const expect = require('@edgeguideab/expect');
const logger = require('app/logger');

module.exports = {
  search,
  create,
  update,
  delete: deleteDocument,
  checkTitle,
  get
};

async function get(req, res) {
  let organization = req.session.organization;
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
  let email = req.session.email;
  let privateKey = req.session.privateKey;
  let index = req.query.index;
  let response;
  try {
    response = await es.paginationSearch({
      searchString,
      organization,
      index
    });
  } catch (error) {
    logger.log('error', `ElaticSearch error, probably malformed search query or server is down. \n ${error}`);
    return res.status(500).send();
  }
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    logger.log('silly', `Cannot find user ${email}`);
    return res.status(404).send();
  }
  try {
    for (let doc of response.hits.hits) {
      doc._source.encrypted_texts = await decryptDocuments(doc._source.encrypted_texts, privateKey, encryptedMasterPassword);
    }
  } catch (error) {
    logger.log('error', `Decrypt error, could not decrypt with privatekey from user ${email}`);
    return res.status(500).send({msg: 'Internal Server Error'});
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
    encryptedMasterPassword = (await users.getUser(req.body.email)).password;
  } catch (error) {
    return res.status(404).send();
  }
  let fields = checkEmptyFields(req.body.doc);
  if (!fields.valid) return res.status(400).send({emptyFields: fields.emptyFields, reason: fields.reason});
  try {
    res.send(await es.addToIndex(req.body.doc, privateKey, encryptedMasterPassword, organization));
    logger.log('info', `User ${req.body.email} created a document with title ${req.body.doc.title}`);
    return;
  } catch (error) {
    logger.log('error', `Could not add document to index ${req.body.doc.index}`);
    return res.status(500).send(error);
  }
}

async function update(req, res) {
  let email = req.session.email;
  let privateKey = req.session.privateKey;

  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    console.error(error);
    return res.status(404).send();
  }
  let fields = checkEmptyFields(req.body.doc);
  if (!fields.valid) return res.status(400).send({emptyFields: fields.emptyFields, reason: fields.reason});

  let response;
  try {
    response = await es.update(req.body, privateKey, encryptedMasterPassword);
    res.send(response);
    logger.log('info', `User ${email} updated document ${req.body.doc.id}`);
  } catch (error) {
    logger.log('error', `Cannot update document ${req.body.doc.id}`);
    res.status(500).send({msg: 'Internal Server Error'});
  }
}

async function deleteDocument(req,res) {
  let response;

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
      logger.log('info', `User ${req.query.email} deleted document ${req.query.id}`);
    } catch (error) {
      logger.log('error', 'Cannot delete document!');
      res.status(500).send();
    }
  }
}
