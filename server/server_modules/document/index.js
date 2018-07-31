const changelog = require('app/changelog');
const fs = require('fs');
const es = require('app/elastic_search');
const checkEmptyFields = require('app/utilities/checkEmptyFields');
const {
  decryptDocuments,
  encryptDocument
} = require('app/encryption/authentication/documentEncryption');
const {
  decryptMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const expect = require('@edgeguideab/expect');
const logger = require('app/logger');
const uuidv4 = require('uuid/v4');

module.exports = {
  search,
  create,
  update,
  delete: deleteDocument,
  checkTitle,
  get
};

async function get(req, res) {
  let organizationIndex = req.session.organizationIndex;
  let email = req.session.email;
  let privateKey = req.session.privateKey;
  let id = req.params.id;
  let expectations = expect(
    {
      id: 'string'
    },
    {
      id: id
    }
  );

  logger.info('/document/id', 'Getting document', id);

  if (!expectations.wereMet()) {
    logger.error('/document/id', 'Client did not send expected body');
    return res.status(400).send(expectations.errors());
  }

  let doc;
  try {
    doc = await es.getDocument({
      organizationIndex,
      documentId: id
    });
  } catch (error) {
    logger.error('/document/id', error);
    return res.status(500).send();
  }

  let encryptedMasterPassword = req.session.mp;

  doc._source.encrypted_texts = doc._source.encrypted_texts || [];
  doc._source.attachments = doc._source.attachments || [];

  doc._source.tags = doc._source.tags || [];
  try {
    doc._source.encrypted_texts = await decryptDocuments(
      doc._source.encrypted_texts,
      privateKey,
      encryptedMasterPassword
    );
  } catch (error) {
    logger.error(
      '/document/id',
      `Decrypt error, could not decrypt with privatekey from user ${email}`,
      error
    );
    return res.status(500).send({ msg: 'Internal Server Error' });
  }

  let logentries;
  try {
    logentries = await changelog.get(doc._id);
  } catch (error) {
    logger.error(
      '/document/id',
      `Cannot get logentries for documentid ${doc._id}`,
      error
    );
  }

  let response = {
    ...doc,
    logentries
  };

  res.send(response);
}

async function checkTitle(req, res) {
  let searchString = req.query.searchString;
  let organizationIndex = req.session.organizationIndex;

  let expectations = expect(
    {
      searchString: {
        type: 'string',
        allowNull: true
      }
    },
    {
      searchString
    }
  );

  if (!expectations.wereMet()) {
    logger.error('/document/check/title', 'Client did not send expected body');
    return res.status(400).send(expectations.errors());
  }

  logger.info(
    '/document/check/title',
    'Checking title of document',
    searchString
  );

  let response;
  try {
    response = await es.searchForDuplicates({
      organization: organizationIndex,
      searchString: searchString
    });
  } catch (error) {
    logger.error('/document/check/title', error);
    return res.status(500).send({
      msg: 'internalServerError'
    });
  }
  res.send(response);
}

async function search(req, res) {
  let searchString = req.query.searchString;
  let organizationIndex = req.session.organizationIndex;
  let results = req.query.results;
  let index = req.query.index;
  let response;

  logger.info('/document', 'Search for document, query:', searchString);

  try {
    response = await es.paginationSearch(
      {
        searchString,
        organizationIndex,
        index
      },
      results
    );
  } catch (error) {
    logger.error(
      '/document',
      `ElaticSearch error, probably malformed search query or server is down. \n ${error}`
    );
    return res.status(500).send();
  }
  res.send({
    searchResult: response.hits.hits,
    totalHits: response.hits.total
  });
}

async function create(req, res) {
  req.body.encryptedTexts = JSON.parse(req.body.encryptedTexts);
  req.body.texts = JSON.parse(req.body.texts);

  let privateKey = req.session.privateKey;
  let organizationIndex = req.session.organizationIndex;
  let encryptedMasterPassword = req.session.mp;
  logger.log('verbose', 'Files:', req.body);

  let fields = checkEmptyFields(req.body);
  if (!fields.valid) {
    logger.warn('/document POST', 'Client sent document with invalid fields');
    return res
      .status(400)
      .send({ emptyFields: fields.emptyFields, reason: fields.reason });
  }

  logger.info(
    '/document POST',
    'Creating a new document with title',
    req.body.title
  );

  let encryptedTexts;
  try {
    encryptedTexts = await encryptDocument(
      req.body.encryptedTexts,
      privateKey,
      encryptedMasterPassword
    );
  } catch (error) {
    logger.error('/document POST', 'Could not encrypt document', error);
    return res.status(500).send();
  }

  logger.log('verbose', 'Files:', req.body);
  logger.log('verbose', 'Files:', req.files);
  //attachments
  let files = {};
  if (req.files) {
    files = Array.from(req.files).map(file => {
      return {
        id: `@${uuidv4()}`,
        name: file.originalname,
        path: file.path,
        file_type: file.mimetype
      };
    });
  }

  let query = {
    title: req.body.title,
    encryptedTexts: encryptedTexts,
    texts: req.body.texts,
    tags: req.body.tags.split(','),
    attachments: files
  };

  let response;

  try {
    response = await es.addToIndex({ query, organizationIndex });
    logger.info(
      '/document POST',
      `User ${req.session.email} created a document with title ${
        req.body.title
      } and id ${response._id}`
    );
  } catch (error) {
    logger.error(
      '/document POST',
      `Could not add document to index ${req.body.index}`,
      error
    );
    return res.status(500).send(error);
  }

  try {
    await changelog.addLogEntry(response._id, req.session.email);
    logger.info(
      '/document POST',
      `Changelog entry for document ${req.body.title} with id ${response._id}`
    );
    logger.info('response', response);
    res.send({ _id: response._id });
  } catch (error) {
    logger.error(
      '/document POST',
      `Could not add changelog entry to for document ${response._id}`,
      error
    );
    return res.status(500).send(error);
  }
}

async function update(req, res) {
  req.body.encryptedTexts = JSON.parse(req.body.encryptedTexts);
  req.body.texts = JSON.parse(req.body.texts);
  req.body.attachments = JSON.parse(req.body.attachments);

  let email = req.session.email;
  let privateKey = req.session.privateKey;
  let organizationIndex = req.session.organizationIndex;

  let encryptedMasterPassword = req.session.mp;
  let fields = checkEmptyFields(req.body);
  if (!fields.valid) {
    logger.error(
      '/document/id PATCH',
      'Client sent update document with invalid fields'
    );
    return res
      .status(400)
      .send({ emptyFields: fields.emptyFields, reason: fields.reason });
  }

  logger.info('/document/id PATCH', 'Updating document', req.body.title);

  let encryptedTexts;
  try {
    encryptedTexts = await encryptDocument(
      req.body.encryptedTexts,
      privateKey,
      encryptedMasterPassword
    );
  } catch (error) {
    logger.error('/document/id PATCH', 'Could not encrypt document', error);
    return res.status(500).send();
  }

  logger.log('verbose', 'Files:', req.files);
  let files = {};
  if (req.files) {
    files = Array.from(req.files).map(file => {
      return {
        id: `@${uuidv4()}`,
        name: file.originalname,
        path: file.path,
        file_type: file.mimetype //TODO: change to file_type, because why make breaking changes..
      };
    });
  }

  let query = {
    type: req.body.type,
    id: req.params.id,
    refresh: true,
    title: req.body.title,
    encryptedTexts: encryptedTexts,
    texts: req.body.texts,
    tags: req.body.tags.split(','),
    attachments: req.body.attachments,
    files
  };

  let response;
  try {
    response = await es.update({ query, organizationIndex });
    logger.info(
      '/document/id PATCH',
      `User ${email} updated document ${req.body.id}`
    );

    await removeFiles(response.removed);
    response.removed = null;
    await changelog.addLogEntry(req.params.id, email);
    logger.info(
      '/document/id PATCH',
      `Added changelog entry for ${email}'s update of document ${req.params.id}`
    );
  } catch (error) {
    logger.error(
      '/document/id PATCH',
      `Cannot update document ${req.body.id}`,
      error
    );
    return res.status(500).send({ msg: 'Internal Server Error' });
  }
  return res.send(response);
}

async function removeFiles(files) {
  try {
    await files.forEach(async file => {
      await removeFile(file.path);
      logger.verbose(
        '/document/id PATCH',
        `Removed file ${file.name} : ${file.id}`
      );
    });
  } catch (error) {
    throw error;
  }
}

function removeFile(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, error => {
      if (error) reject(error);
      resolve();
    });
  });
}

async function deleteDocument(req, res) {
  let response;
  let encryptedMasterPassword = req.session.mp;
  try {
    decryptMasterPassword(req.session.privateKey, encryptedMasterPassword);
    logger.log(
      'verbose',
      '/document/id DELETE',
      `Successfully authenticated user ${
        req.session.email
      } for deleting document ${req.params.id}`
    );
  } catch (error) {
    logger.error(
      '/document/id DELETE',
      `User ${req.session.email} tried to delete ${
        req.params.id
      } without proper authentication`
    );
    res.status(409).send();
  }

  logger.info(
    '/document/id DELETE',
    'User',
    req.session.email,
    'deletes document',
    req.params.id
  );

  let query = {
    organizationIndex: req.session.organizationIndex,
    id: req.params.id,
    type: req.query.type
  };

  logger.verbose('DELETE DOCUMENT', query);

  let expectations = expect(
    {
      organizationIndex: 'string',
      type: 'string',
      id: 'string'
    },
    query
  );
  if (!expectations.wereMet()) {
    logger.error('/document/id DELETE', 'Client sent request that was invalid');
    res.status(400).send(expectations.errors());
  } else {
    try {
      let attachments = await es.getAttachment({
        organizationIndex: query.organizationIndex,
        documentId: query.id
      });

      attachments = attachments.filter(a => a.path !== undefined);
      logger.verbose('DELETE ATTACHMENTS', attachments);
      response = await es.deleteDocument(query);
      logger.info(
        '/document/id DELETE',
        `User ${req.session.email} deleted document ${req.params.id}`
      );

      await removeFiles(attachments);
      await changelog.remove(req.params.id);
    } catch (error) {
      logger.error('/document/id DELETE', 'Cannot delete document!', error);
      return res.status(500).send();
    }
    return res.send(response);
  }
}
