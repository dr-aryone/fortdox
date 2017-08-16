const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const es = require('app/elastic_search');
const cleanup = require('app/database_cleanup/cleanup.js');
const CronJob = require('cron').CronJob;
const logger = require('app/logger');
const routes = require('./routes');
const PORT = 8000;

const job = new CronJob('*/5 * * * *', async () => {
  try {
    await cleanup(30, es);
  } catch (error) {
    console.error(error);
  }
});
job.start();

app.use(bodyParser.json({limit: '100mb'}));
app.use('/downloads', (req, res, next) => {console.log(req.originalUrl); next();}, express.static('/opt/fortdox'));
app.use('/', routes);

app.listen(PORT, () => {
  logger.info(`Server started listening on port ${PORT}`);
});

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req,res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
