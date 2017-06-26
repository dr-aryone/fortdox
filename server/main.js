const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const statusMsg = require('./statusMsg.json');
const es = require('./es');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send();
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});

app.post('/login', async (req, res) => {
  let status = await users.verifyUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
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

app.post('/user/form', async (req, res) => {
  let query = {
    index: 'document',
    type: 'form',
    body: {
      title: req.body.title,
      text: req.body.text
    }
  };
  console.log(req.body.title);
  try {
    res.send(await es.addIndex(query));
  } catch (error) {
    console.log(error);
  }
});


app.post('/user/search', async (req, res) => {
  let query = {
    index: 'document',
    searchQuery: {
      title: req.body.searchString
    }
  };
  let response;
  try {
    response = await es.search(query);
  } catch (error) {
    console.error(error);
  }

  res.send(response.hits.hits[0]._source);

});


app.patch('/user/search/edit', async (req, res) => {
  let response;
  try {
    response = await es.update(req.body.query);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
