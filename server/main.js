const express = require('express');
const app = express();
const cleanup = require('app/database_cleanup/cleanup');
const CronJob = require('cron').CronJob;
const logger = require('app/logger');
const routes = require('./routes');
const { checkVersion } = require('app/middleware/versionMiddleware');
const timer = require('app/middleware/timerMiddleware');
const bodyParser = require('body-parser');
const allowCrossDomain = require('app/middleware/corsMiddleware');
const PORT = 8000;
const flags = require('flags');

flags.defineBoolean('dev', false);
flags.defineBoolean('verbose', false);
flags.parse();

const devMode = flags.get('dev');
const verboseMode = flags.get('verbose');

if (verboseMode || devMode) {
  logger.transports.console.level = 'verbose';
}

const job = new CronJob('*/30 * * * *', async () => {
  try {
    await cleanup();
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
});
job.start();

app.use(allowCrossDomain);
app.use(timer);
app.use(checkVersion);
app.use(bodyParser.json({ limit: '100mb' }));

app.use('/', routes);

app.get('/activation-redirect', (req, res) => {
  logger.info('Organization', 'acitivation redirect');
  res.sendFile(__dirname + '/redirect.html');
});

app.get('/invite-redirect', (req, res) => {
  logger.info('Invite', 'activation redirect');
  res.sendFile(__dirname + '/invite-redirect.html');
});

app.listen(PORT, () => {
  if (devMode) {
    logger.info('Dev mode is enabled', 'For testing..');
  }
  logger.info(`Server started listening on port ${PORT}`);
});
