const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello world'});
});

app.post('/user/form', (req, res) => {
  res.send();
});

app.post('/login', async (req, res) => {
  let loggedIn = await users.verifyUser(req.body.username, req.body.password);
  res.send({
    username: req.body.username,
    loggedIn
  });
});

app.post('/register', async (req, res) => {
  let userWasAdded = await users.createUser(req.body.username, req.body.password);
  res.send({
    username: req.body.username,
    status: userWasAdded
  });
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});
