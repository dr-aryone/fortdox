const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const statusMsg = require('./statusMsg.json');
const es = require('./server_modules/es');
const {decryptDocuments} = require('./server_modules/crypt/authentication/cryptDocument');
const {decryptMasterPassword} = require('./server_modules/crypt/keys/cryptMasterPassword');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send();
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});

app.post('/login', async (req, res) => {
  let status;
  try {
    await decryptMasterPassword(req.body.privateKey);
    status = 200;
  } catch (error) {
    console.error(error);
    status = 401;
  }
  res.status(status).send({
    message: statusMsg.user[status]
  });
});

app.post('/register', async (req, res) => {
  let status = await users.createUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
    message: statusMsg.user[status]
  });
});

app.post('/documents', async (req, res) => {
  try {
    res.send(await es.addToIndex(req.body));
  } catch (error) {
    console.log(error);
    res.send(500).send({msg: 'Internal Server Error'});
  }
});

app.get('/documents', async (req, res) => {
  let response;
  let searchString = req.query.searchString;
  let privateKey = decodeURIComponent(req.headers.authorization).split('FortDoks ')[1];
  debugger;
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
  let response;
  try {
    response = await es.update(req.body);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send({msg: 'Internal Server Error'});
  }
});

app.delete('/documents', async (req,res) => {
  let response;
  let deleteQuery = {};
  deleteQuery['index'] = req.query.index;
  deleteQuery['type'] = req.query.type;
  deleteQuery['id'] = req.query.id;
  try {
    response = await es.deleteDocument(deleteQuery);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
});
