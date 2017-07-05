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
const expect = require('@edgeguideab/expect');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send();
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});

app.post('/login', async (req, res) => {
  let status;
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = await users.getPassword(req.body.email);
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }

  try {
    let privateKey = new Buffer(req.headers.authorization.split('FortDoks ')[1], 'base64').toString();
    await decryptMasterPassword(privateKey, encryptedMasterPassword);
    status = 200;
  } catch (error) {
    console.error(error);
    return status = 401;
  }
  res.status(status).send({
    message: statusMsg.user[status]
  });
});

app.post('/register', async (req, res) => {
  let organizationId;
  try {
    organizationId = (await orgs.createOrganization(req.body.organization)).id;
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
  let keypair;
  try {
    keypair = await keygen.genKeyPair();
  } catch (error) {
    console.error(error);
    return res.status(500).send();
  }
  let masterPassword = keygen.genMasterPassword();
  let encryptedMasterPassword = encryptMasterPassword(keypair.publicKey, masterPassword);

  try {
    await users.createUser(req.body.username, req.body.email, encryptedMasterPassword, organizationId);
    return res.send({privateKey: keypair.privateKey.toString('base64')});
  } catch (error) {
    console.error(error);
    return res.status(error).send();
  }
});

app.post('/register/confirm', async (req, res) => {
  let email = req.body.email;
  let privateKey = new Buffer(req.headers.authorization.split('FortDoks ')[1], 'base64').toString();
  try {
    privateKey = Buffer.from(privateKey, 'base64').toString();
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
    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }


});

app.post('/documents', async (req, res) => {
  let privateKey = new Buffer(req.headers.authorization.split('FortDoks ')[1], 'base64').toString();
  let encryptedMasterPassword;
  let organization;

  try {
    encryptedMasterPassword = await users.getPassword(req.body.email);
    organization = await users.getOrganization(req.body.email);
  } catch (error) {
    res.status(409).send();
  }

  try {
    res.send(await es.addToIndex(req.body, privateKey, encryptedMasterPassword, organization));
  } catch (error) {
    console.log(error);
    res.send(500).send({msg: 'Internal Server Error'});
  }

});

app.get('/documents', async (req, res) => {
  let response;
  let searchString = req.query.searchString;
  let privateKey = new Buffer(req.headers.authorization.split('FortDoks ')[1], 'base64').toString();
  try {
    response = await es.search({
      searchString
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
  try {
    response.hits.hits = await decryptDocuments(response.hits.hits, privateKey);
  } catch (error) {
    console.error(error);
    return res.status(500).send({msg: 'Internal Server Error'});
  }
  res.send(response.hits.hits);
});

app.patch('/documents', async (req, res) => {
  let privateKey =  new Buffer(req.headers.authorization.split('FortDoks ')[1], 'base64').toString();
  let response;
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
      response = await es.update(req.body, privateKey);
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
