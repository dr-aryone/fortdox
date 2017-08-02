const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const keygen = require('./server_modules/encryption/keys/keygen');
const orgs = require('./server_modules/organizations');
const statusMsg = require('./statusMsg.json');
const es = require('./server_modules/elastic_search');
const {decryptDocuments} = require('./server_modules/encryption/authentication/documentEncryption');
const {decryptMasterPassword} = require('./server_modules/encryption/keys/cryptMasterPassword');
const {encryptMasterPassword} = require('./server_modules/encryption/keys/cryptMasterPassword');
const {encryptPrivateKey} = require('./server_modules/encryption/authentication/privateKeyEncryption');
const {decryptPrivateKey} = require('./server_modules/encryption/authentication/privateKeyEncryption');
const mailer = require('./server_modules/mailer');
const expect = require('@edgeguideab/expect');
const uuidv1 = require('uuid/v1');
const cleanup = require('./server_modules/database_cleanup/cleanup.js');
const CronJob = require('cron').CronJob;
const extract = require('./server_modules/utilities/extract');
const sessions = require('./server_modules/utilities/session');
const logger = require('./server_modules/logger');
const moment = require('moment');
const secret = keygen.genRandomPassword();
const job = new CronJob('*/5 * * * *', async () => {
  try {
    await cleanup(30, es);
  } catch (error) {
    console.error(error);
  }
});
const yaml = require('js-yaml');
const fs = require('fs');

job.start();

app.use(bodyParser.json());

app.use('/downloads', (req, res, next) => {console.log(req.originalUrl); next();}, express.static('/opt/fortdox'));

app.listen(8000, () => {
});

app.post('/login', async (req, res) => {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    return res.status(400).send();
  }
  let objToStore = {
    privateKey,
    sessionStart: moment()
  };
  try {
    await decryptMasterPassword(privateKey, user.password);
    objToStore = (await encryptPrivateKey(secret, JSON.stringify(objToStore))).toString('base64');
    return res.send({
      email: user.email,
      objToStore
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      message: statusMsg.user[401]
    });
  }
});

app.post('/login/session', async (req, res) => {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
  let session;
  try {
    session = extract.sessionKey(req.headers.authorization);
    session = JSON.parse(await decryptPrivateKey(secret, session));
  } catch (error) {
    return res.status(400).send();
  }
  if (!sessions.stillAlive(session.sessionStart)) {
    return res.status(440).send();
  }
  try {
    await decryptMasterPassword(session.privateKey, user.password);
    return res.send({
      email: user.email,
      privateKey: Buffer.from(session.privateKey).toString('base64')
    });
  } catch (error) {
    console.error(error);
    return res.status(401).send({
      message: statusMsg.user[401]
    });
  }
});

app.post('/register', async (req, res) => {
  let uuid = uuidv1();
  let newUser = {
    email: req.body.email,
    password: null,
    organizationId: null,
    uuid
  };
  let organizationId;
  let email = req.body.email;
  try {
    await users.createUser(newUser);
  } catch (error) {
    console.error(error);
    return res.status(error).send('user');
  }
  try {
    organizationId = (await orgs.createOrganization(req.body.organization)).id;
    await users.setOrganizationId({
      email,
      organizationId
    });
  } catch (error) {
    console.error(error);
    return res.status(error).send('organization');
  }
  let mail = mailer.firstTimeRegistration({
    to: newUser.email,
    organization: req.body.organization,
    uuid: newUser.uuid
  });
  try {
    mailer.send(mail);
  } catch (error) {
    console.error(error);
    return res.status(error).send('mail');
  }
  res.send();
});

app.post('/register/confirm', async (req, res) => {
  let email = req.body.email;
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    return res.status(400).send();
  }
  try {
    await users.verifyUser(email, privateKey);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
  let organizationName;
  try {
    organizationName = await users.getOrganizationName(email);
  } catch (error) {
    console.error(error);
    res.status(404).send();
  }
  try {
    await es.createIndex(organizationName);
    await orgs.activateOrganization(organizationName);
    let user = await users.getUser(email);
    res.status(200).send({
      organizationName,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.post('/register/verify', async (req, res) => {
  let user;
  let keypair;
  try {
    user = await users.verifyUUID(req.body.activationCode);
  } catch (error) {
    console.error(error);
    res.status(error).send();
  }
  try {
    keypair = await keygen.genKeyPair();
  } catch (error) {
    console.error(error);
  }
  let masterPassword = keygen.genRandomPassword();
  let encryptedMasterPassword = encryptMasterPassword(keypair.publicKey, masterPassword);
  try {
    await users.setPassword({
      email: user.email,
      organizationId: user.organizationId
    },
    encryptedMasterPassword);
    res.send({
      email: user.email,
      privateKey: keypair.privateKey.toString('base64')
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }

});

app.post('/invite', async (req, res) => {
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    return res.status(400).send('header');
  }
  let newUserEmail = req.body.newUserEmail;
  let email = req.body.email;
  let encryptedMasterPassword;
  let organizationId;
  let keypair;
  let sender;
  let uuid = uuidv1();
  try {
    sender = await users.getUser(email);
    encryptedMasterPassword = sender.password;
    organizationId = sender.organizationId;
    keypair = await keygen.genKeyPair();
  } catch (error) {
    return res.status(409).send();
  }
  let masterPassword = decryptMasterPassword(privateKey, encryptedMasterPassword);
  let newEncryptedMasterPassword = encryptMasterPassword(keypair.publicKey, masterPassword);
  let tempPassword = keygen.genRandomPassword();
  let encryptedPrivateKey;
  try {
    encryptedPrivateKey = await encryptPrivateKey(tempPassword, keypair.privateKey);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
  let newUser = {
    email: newUserEmail,
    password: newEncryptedMasterPassword,
    organizationId,
    uuid
  };
  try {
    await users.createUser(newUser);
    await users.TempKeys.store(uuid, encryptedPrivateKey);
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
  let mail = mailer.newUserRegistration({
    to: newUserEmail,
    organization: sender.Organization.name,
    from: sender.email,
    uuid,
    tempPassword: tempPassword.toString('base64')
  });
  try {
    mailer.send(mail);
  } catch (error) {
    console.error(error);
    return res.status(400).send('mail');
  }
  res.send();
});

app.post('/invite/verify', async (req, res) => {
  let uuid = req.body.uuid;
  let tempPassword = Buffer.from(decodeURIComponent(req.body.temporaryPassword), 'base64');
  let encryptedPrivateKey;
  let privateKey;
  try {
    encryptedPrivateKey = new Buffer((await users.getEncryptedPrivateKey(uuid)), 'base64');
    privateKey = (await decryptPrivateKey(tempPassword, encryptedPrivateKey)).toString('base64');
    return res.send({
      privateKey
    });
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});

app.post('/invite/confirm', async (req, res) => {
  let uuid = req.body.uuid;
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    return res.status(400).send();
  }
  let metadata;
  try {
    metadata = await users.verifyNewUser(uuid, privateKey);
    await users.TempKeys.remove(uuid);
    return res.send(metadata);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }


});

app.get('/document', async (req, res) => {
  let searchString = req.query.searchString;
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
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
    console.error(error);
    return res.status(500).send();
  }
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    console.error(error);
    return res.status(404).send();
  }
  try {
    response.hits.hits = await decryptDocuments(response.hits.hits, privateKey, encryptedMasterPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
  res.send({
    searchResult: response.hits.hits,
    totalHits: response.hits.total
  });
});

app.post('/document', async (req, res) => {
  if (req.body.doc.title.trim() === '' || req.body.doc.text.trim() === '') {
    return res.status(400).send({msg: 'Bad format, title and/or text field(s) cannot be empty'});
  }
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
    res.status(404).send();
  }
  try {
    res.send(await es.addToIndex(req.body.doc, req.body.tags, privateKey, encryptedMasterPassword, organization));
  } catch (error) {
    console.error(error);
    res.send(500).send(error);
  }
});

app.patch('/document', async (req, res) => {
  if (req.body.updateQuery.title.trim() === '' || req.body.updateQuery.encrypted_text.trim() === '') {
    return res.status(400).send({msg: 'Bad format, title and/or text field(s) cannot be empty'});
  }
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
  let expectations = expect({
    index: 'string',
    type: 'string',
    id: 'string',
    updateQuery: 'object'
  }, req.body);
  if (!expectations.wereMet()) {
    res.status(400).send({msg: 'Bad data format, please priovide atleast index, type, id'});
  } else {
    try {
      encryptedMasterPassword = (await users.getUser(email)).password;
    } catch (error) {
      console.error(error);
      return res.status(404).send();
    }
    try {
      response = await es.update(req.body, privateKey, encryptedMasterPassword);
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send({msg: 'Internal Server Error'});
    }
  }
});

app.delete('/document', async (req,res) => {
  let response;
  let expectations = expect({
    index: 'string',
    type: 'string',
    id: 'string'
  }, req.query);
  if (!expectations.wereMet()) {
    res.status(400).send({msg: 'Bad data format, please priovide atleast index, type, id'});
  } else {
    try {
      response = await es.deleteDocument(req.query);
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send();
    }
  }
});

app.get('/tags', async (req, res) => {
  let organization = req.query.organization;
  let response;
  try {
    response = await es.getTags(organization);
    return res.send(response.aggregations.distinct_tags.buckets);
  } catch (error) {
    return res.status(500).send();
  }
});

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req,res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
