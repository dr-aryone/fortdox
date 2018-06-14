const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cleanup = require('app/database_cleanup/cleanup');
const CronJob = require('cron').CronJob;
const logger = require('app/logger');
const routes = require('./routes');
const cors = require('cors');
const config = require('app/config.json');
const PORT = 8000;
const devMode = process.argv[2] === '--dev';
console.log('dev?', devMode);

const job = new CronJob('*/30 * * * *', async () => {
  try {
    await cleanup();
  } catch (error) {
    console.error(error);
  }
});
job.start();

if (devMode) {
  console.log(config);
  app.use(cors({ origin: config.cors, credentials: true }));
}
app.use(bodyParser.json({ limit: '100mb' }));
app.use(
  '/downloads',
  (req, res, next) => {
    console.log(req.originalUrl);
    next();
  },
  express.static('/opt/fortdox')
);
app.use('/', routes);

app.listen(PORT, () => {
  logger.info(`Server started listening on port ${PORT}`);
});

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req, res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
