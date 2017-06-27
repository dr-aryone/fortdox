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

app.post('/documents', async (req, res) => {
  // let document = {};
  // let index = req.body.index;
  // let type = req.body.type;
  //
  // (req.body.title !== null) ? document['title'] = req.body.title : null;
  //   (req.body.title !== null) ? document['title'] = req.body.text : null;
  console.log(req.body);
  try {
    res.send(await es.addIndex(req.body));
  } catch (error) {
    console.log(error);
  }
});


app.get('/documents', async (req, res) => {
  let response;
  let searchQuery = {};
  try {
    console.log(req.query);
    let index = req.query.index;
    (req.query.title !== '') ? searchQuery['title'] = req.query.title : null;

    response = await es.search({
      index,
      searchQuery
    });
  } catch (error) {
    console.error(error);
  }
  res.send(response.hits.hits);
});

app.patch('/documents', async (req, res) => {
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

app.delete('/documents', async (req,res) => {
  let response;
  let deleteQuery = {};
  deleteQuery['index'] = req.query.index;
  deleteQuery['type'] = req.query.type;
  deleteQuery['id'] = req.query.id;
  console.log(req.query);
  try {
    response = await es.deleteDocument(deleteQuery);
    res.send(response);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
