const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');
const statusMsg = require('./statusMsg.json');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello world'});
});

app.post('/user/form', (req, res) => {
  res.send();
});

app.post('/login', async (req, res) => {
  let status = await users.verifyUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
    message:  statusMsg[status]
  });

});

app.post('/register', async (req, res) => {
  let status = await users.createUser(req.body.username, req.body.password);
  res.status(status).send({
    username: req.body.username,
    message:  statusMsg.status
  });
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});
