const users = require('app/users');
const es = require('app/elastic_search');
const {decryptDocuments} = require('app/encryption/authentication/documentEncryption');
const checkEmptyFields = require('app/utilities/checkEmptyFields');
const expect = require('@edgeguideab/expect');
const extract = require('app/utilities/extract');
const logger = require('app/logger');

module.exports = {
  search,
  create,
  update,
  delete: deleteDocument
};

async function search(req, res) {
  let searchString = req.query.searchString;
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    logger.log('silly', `Could not extract content from ${req.query.email} @ GET /document`);
    return res.status(400).send();
  }
  let organization = req.query.organization;
  let email = req.query.email;
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
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    return res.status(400).send();
  }
  let encryptedMasterPassword;
  let organization;
  try {
    encryptedMasterPassword = (await users.getUser(req.body.email)).password;
    organization = await users.getOrganizationName(req.body.email);
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
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    console.error(error);
    return res.status(400).send();
  }
  let response;
  let email = req.body.email;
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    console.error(error);
    return res.status(404).send();
  }
  let fields = checkEmptyFields(req.body.doc);
  if (!fields.valid) return res.status(400).send({emptyFields: fields.emptyFields, reason: fields.reason});
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
  let expectations = expect({
    index: 'string',
    type: 'string',
    id: 'string'
  }, req.query);
  if (!expectations.wereMet()) {
    res.status(400).send(expectations.errors());
  } else {
    try {
      response = await es.deleteDocument(req.query);
      res.send(response);
      logger.log('info', `User ${req.query.email} deleted document ${req.query.id}`);
    } catch (error) {
      logger.log('error', 'Cannot delete document!');
      res.status(500).send();
    }
  }
}
