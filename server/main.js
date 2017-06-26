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
  try {
    res.send(await es.addIndex(req.body));
  } catch (error) {
    console.log(error);
  }
});


app.post('/user/search', async (req, res) => {
  let response;
  try {
    console.log(req.body);
    response = await es.search(req.body);
  } catch (error) {
    console.error(error);
  }
  res.send(response.hits.hits);
});
app.patch('/document', async (req, res) => {
  let response;
  console.log(req.body);
  try {
    response = await es.update(req.body);
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});
