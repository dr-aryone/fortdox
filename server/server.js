const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({message: 'Hello world'});
});

app.get('/test', (req, res) => {
  res.send({message: 'It is working!'});
});

app.post('/try', (req, res) => {
  console.log(req.body);
  res.send();
});

app.post('/user', (req, res) => {
  res.send({
    username: req.body.username,
    status: true
  });
  console.log('done');
});

app.listen(8000, () => {
  console.log('listening to port: 8000');
});
