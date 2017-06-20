const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./server_modules/users');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello world'});
});

app.get('/test', (req, res) => {
  res.send({message: 'It is working!'});
});

app.post('/login', async (req, res) => {
  let loggedIn = await users.verifyUser(req.body.username, req.body.password);
  res.send({
    username: req.body.username,
    status: loggedIn
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
