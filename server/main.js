const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cleanup = require('app/database_cleanup/cleanup');
const CronJob = require('cron').CronJob;
const logger = require('app/logger');
const routes = require('./routes');
const PORT = 8000;
const devMode = process.argv[2] === '--dev';

const job = new CronJob('*/30 * * * *', async () => {
  try {
    await cleanup();
  } catch (error) {
    console.error(error);
  }
});
job.start();

const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Methods',
    'OPTION,GET,PUT,POST,DELETE,PATCH'
  );
  res.header(
    'Access-Control-Allow-Headers',
    req.get('Access-Control-Request-Headers')
  );
  res.header('Vary', 'Origin,Access-Control-Request-Headers');

  if (req.method.toUpperCase() === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Content-Length', '0');
    res.end();
  } else {
    next();
  }
};

const { checkVersion } = require('./versionMiddleware');
app.use(allowCrossDomain);
app.use(checkVersion);

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
  if (devMode) {
    logger.info('Dev mode is enabled');
  }
  logger.info(`Server started listening on port ${PORT}`);
});

app.get('/activation-redirect', (req, res) => {
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req, res) => {
  res.sendFile(__dirname + '/invite-redirect.html');
});
