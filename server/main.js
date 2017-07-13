const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const keygen = require('./server_modules/crypt/keys/keygen');
const orgs = require('./server_modules/organizations');
const statusMsg = require('./statusMsg.json');
const es = require('./server_modules/es');
const {decryptDocuments} = require('./server_modules/crypt/authentication/cryptDocument');
const {decryptMasterPassword} = require('./server_modules/crypt/keys/cryptMasterPassword');
const {encryptMasterPassword} = require('./server_modules/crypt/keys/cryptMasterPassword');
const {encryptPrivateKey} = require('./server_modules/crypt/authentication/cryptPrivateKey');
const {decryptPrivateKey} = require('./server_modules/crypt/authentication/cryptPrivateKey');
const mailer = require('./server_modules/mailer');
const expect = require('@edgeguideab/expect');
const uuidv1 = require('uuid/v1');
const cleanUp = require('./server_modules/db_maid/cleanUp.js');
const CronJob = require('cron').CronJob;
const extractPrivateKey = require('./server_modules/utilities/extractPrivateKey');

const job = new CronJob('*/5 * * * *', async () => {
  try {
    await cleanUp(30);
    console.log('cleaned');
  } catch (error) {
    console.error(error);
  }
});

job.start();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send();
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});

app.post('/login', async (req, res) => {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }

  try {
    let privateKey = extractPrivateKey(req.headers.authorization);
    await decryptMasterPassword(privateKey, user.password);
    return res.send({
      user: user.username,
      organization: user.Organization.organization
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
    username: req.body.username,
    email: req.body.email,
    password: null,
    organizationId: null,
    uuid
  };
  try {
    newUser.organizationId = (await orgs.createOrganization(req.body.organization)).id;
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
  try {
    await users.createUser(newUser);
    let mail = mailer.firstTimeRegistration({to: newUser.email, organization: req.body.organization, uuid: newUser.uuid});
    mailer.send(mail);
    res.send();
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }

});

app.post('/register/confirm', async (req, res) => {
  let email = req.body.email;
  let privateKey = extractPrivateKey(req.headers.authorization);
  try {
    await users.verifyUser(email, privateKey);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
  let organizationName;
  try {
    organizationName = await users.getOrganization(email);
  } catch (error) {
    console.error(error);
    res.status(404).send();
  }

  try {
    await es.createIndex(organizationName);
    await orgs.activateOrganization(organizationName);
    res.status(200).send();
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
    res.status(500).send();
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
  let privateKey = extractPrivateKey(req.headers.authorization);
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
    username: null,
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
    return res.status(500).send();
  }
  let mail = mailer.newUserRegistration({
    to: newUserEmail,
    organization: sender.Organization.organization,
    from: sender.username,
    uuid,
    tempPassword: tempPassword.toString('base64')
  });
  mailer.send(mail);
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
  let username = req.body.username;
  let privateKey = extractPrivateKey(req.headers.authorization);
  let metadata;
  try {
    metadata = await users.verifyNewUser(uuid, privateKey, username);
    await users.TempKeys.remove(uuid);
    return res.send(metadata);
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }


});
app.post('/documents', async (req, res) => {
  if (req.body.title || req.body.text === '') {
    return res.status(400).send({msg: 'Bad format, title and/or text cannot be empty'});
  }
  let privateKey = extractPrivateKey(req.headers.authorization);
  let encryptedMasterPassword;
  let organization;

  try {
    encryptedMasterPassword = (await users.getUser(req.body.email)).password;
    organization = await users.getOrganization(req.body.email);
  } catch (error) {
    res.status(409).send();
  }
  try {
    res.send(await es.addToIndex(req.body, privateKey, encryptedMasterPassword, organization));
  } catch (error) {
    console.log(error);
    res.send(500).send(error);
  }

});

app.get('/documents', async (req, res) => {
  let response;
  let searchString = req.query.searchString;
  let privateKey = extractPrivateKey(req.headers.authorization);
  let organization = req.query.organization;
  let email = req.query.email;
  let encryptedMasterPassword;
  try {
    response = await es.search({
      searchString,
      organization
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
  try {
    encryptedMasterPassword = (await users.getUser(email)).password;
  } catch (error) {
    console.error(error);
    return res.status(409).send();
  }
  try {
    response.hits.hits = await decryptDocuments(response.hits.hits, privateKey, encryptedMasterPassword);
  } catch (error) {
    console.error(error);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
  res.send(response.hits.hits);
});

app.patch('/documents', async (req, res) => {
  if (req.body.title || req.body.text === '') {
    return res.status(400).send({msg: 'Bad format, title and/or text cannot be empty'});
  }
  let privateKey = extractPrivateKey(req.headers.authorization);
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
      return res.status(409).send();
    }
    try {
      response = await es.update(req.body, privateKey, encryptedMasterPassword);
      res.send(response);
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: 'Internal Server Error'});
    }
  }
});

app.delete('/documents', async (req,res) => {
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

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req,res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
