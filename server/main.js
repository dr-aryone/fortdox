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
const checkEmptyFields = require('./server_modules/utilities/checkEmptyFields');
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
job.start();

app.use(bodyParser.json({limit: '100mb'}));

app.use('/downloads', (req, res, next) => {console.log(req.originalUrl); next();}, express.static('/opt/fortdox'));

app.listen(8000, () => {
});

app.post('/login', async (req, res) => {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    logger.log('silly', '/login: No existing user ' + req.body.email);
    return res.status(error).send();
  }
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    logger.log('info', 'No content in header Authorization');
    return res.status(400).send();
  }
  let objToStore = {
    privateKey,
    sessionStart: moment()
  };
  try {
    await decryptMasterPassword(privateKey, user.password);
    objToStore = (await encryptPrivateKey(secret, JSON.stringify(objToStore))).toString('base64');
    res.send({
      email: user.email,
      objToStore
    });
    logger.log('info', `User ${req.body.email} has logged in!`);
    return;
  } catch (error) {
    logger.log('silly', `Encrypting LocalStorage object failed for user ${req.body.email}`);
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
    logger.log('silly', '/login/session: No existing user ' + req.body.email);
    return res.status(error).send();
  }
  let session;
  try {
    session = extract.sessionKey(req.headers.authorization);
    session = JSON.parse(await decryptPrivateKey(secret, session));
  } catch (error) {
    logger.log('silly', 'Probably failed because secret was updated or session expired/was never initiated');
    return res.status(401).send({
      message: statusMsg.session[401]
    });
  }
  if (!sessions.stillAlive(session.sessionStart)) {
    logger.log('silly', 'Session expired for ' + req.body.email);
    return res.status(401).send({
      message: statusMsg.session[401]
    });
  }
  try {
    await decryptMasterPassword(session.privateKey, user.password);
    res.send({
      email: user.email,
      privateKey: Buffer.from(session.privateKey).toString('base64')
    });
    logger.log('info', `User ${req.body.email} logged in via session!`);
    return;
  } catch (error) {
    logger.log('error', 'Could not decrypt master password for ' + req.body.email);
    return res.status(401).send({
      message: statusMsg.session[401]
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
    await orgs.getName(req.body.organization);
  } catch (error) {
    logger.log('silly', `Organization ${req.body.organization} already exists`);
    return res.status(error).send('organization');
  }
  try {
    await users.createUser(newUser);
    logger.log('silly', `User ${req.body.email} was created!`);
  } catch (error) {
    logger.log('silly', `User ${req.body.email} already exists`);
    return res.status(error).send('user');
  }
  try {
    organizationId = (await orgs.createOrganization(req.body.organization)).id;
    await users.setOrganizationId({
      email,
      organizationId
    });
  } catch (error) {
    logger.log('error', `Could not set Organization ID (${organizationId}) for ${email}`);
    return res.status(error).send('organization');
  }
  let mail = mailer.firstTimeRegistration({
    to: newUser.email,
    organization: req.body.organization,
    uuid: newUser.uuid
  });
  try {
    mailer.send(mail);
    logger.log('silly', `User ${req.body.email} sent an activation mail for organization ${req.body.organization}`);
  } catch (error) {
    logger.log('silly', `Could not send email to ${newUser.email} probably because email does not exist`);
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
    logger.log('silly', `Could not extract content from Authorization headrer for ${email} @ /register/confirm`);
    return res.status(400).send();
  }
  try {
    await users.verifyUser(email, privateKey);
  } catch (error) {
    logger.log('error', `Could not verify user ${email}, possibly malformed/incorrect private key or mysql server is down`);
    return res.status(500).send();
  }
  let organizationName;
  try {
    organizationName = await users.getOrganizationName(email);
  } catch (error) {
    logger.log('silly', `Could not connect user ${email} with an organization. Probable cause could be mysql server is down.`);
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
    logger.log('info', `User ${user.email} successfully created organization ${organizationName}`);
  } catch (error) {
    logger.log('error', `Check ElasticSearch and MSQL server connections. Failing that check if ${organizationName} already exists`);
    res.status(500).send();
  }
});

app.post('/register/verify', async (req, res) => {
  let user;
  let keypair;
  try {
    user = await users.verifyUUID(req.body.activationCode);
  } catch (error) {
    logger.log('silly', `Could not verify User with UUID ${req.body.activationCode}. Probably because user does not exist or server is down.`);
    res.status(error).send();
  }
  try {
    keypair = await keygen.genKeyPair();
  } catch (error) {
    logger.log('error', `Generating keypair for new user ${user.email}`);
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
    logger.log('error', `Could not set encrypted master password for ${user.email}. Check MYSQL connection, or if ${user.email} does not exist`);
    res.status(500).send();
  }

});

app.post('/invite', async (req, res) => {
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    logger.log('silly', `Could not extract content from Authorization header for ${req.body.email} @ /invite`);
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
    logger.log('silly', `Could not find sender ${email} @ /invite`);
    return res.status(409).send();
  }
  let masterPassword = decryptMasterPassword(privateKey, encryptedMasterPassword);
  let newEncryptedMasterPassword = encryptMasterPassword(keypair.publicKey, masterPassword);
  let tempPassword = keygen.genRandomPassword();
  let encryptedPrivateKey;
  try {
    encryptedPrivateKey = await encryptPrivateKey(tempPassword, keypair.privateKey);
  } catch (error) {
    logger.log('error', `Cannot encrypt temporary password for ${newUserEmail} @ /invite. \n ${error}`);
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
    logger.log('info', `User ${newUser.email} was created and given the UUID ${uuid}`);
  } catch (error) {
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
    logger.log('info', `User ${req.body.email} invited ${newUserEmail} to join ${sender.Organization.name}`);
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
    res.send({
      privateKey
    });
    logger.log('silly', `Keypair generated and private key was sent to user with UUID ${uuid}`);
    return;
  } catch (error) {
    logger.log('error', `Could not find user with UUID ${uuid}`);
    return res.status(500).send();
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
    res.send(metadata);
    logger.log('info', `User ${metadata.email} was added to ${metadata.organization}`);
  } catch (error) {
    logger.log('error', `Cannot verify User with uuid ${uuid} @ /invite/confirm`);
    return res.status(500).send();
  }


});

app.get('/document', async (req, res) => {
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
});

app.post('/document', async (req, res) => {
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
});

app.patch('/document', async (req, res) => {
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

});

app.delete('/document', async (req,res) => {
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
});

app.get('/tags', async (req, res) => {
  let organization = req.query.organization;
  let response;
  try {
    response = await es.getTags(organization);
    return res.send(response.aggregations.distinct_tags.buckets);
  } catch (error) {
    logger.log('error', 'Could not get tags!');
    return res.status(500).send();
  }
});

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req,res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
