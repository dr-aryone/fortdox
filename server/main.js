const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const statusMsg = require('./statusMsg.json');
const es = require('./es/elasticsearch');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello world'});
});

app.post('/user/form', async (req, res) => {
  let response;
  try {
    response = await es.index({
      index: 'document',
      type: 'form',
      body: {
        title: req.body.title,
        text: req.body.text
      }
    });
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

app.post('/login', async (req, res) => {
  let status = await users.verifyUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
    message: statusMsg[status]
  });
});

app.post('/register', async (req, res) => {
  let status = await users.createUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
    message: statusMsg[status]
  });
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});

app.post('/user/search', async (req, res) => {
  let response;
  try {
    response = await es.search({
      index: 'document',
      type: 'form',
      body: {
        query: {
          match: {
            title: req.body.searchString
          }
        }
      }
    });
    console.log(response.hits.hits);
    res.send({message: response.hits.hits});
  } catch (error) {
    console.log(error);
  }
});
