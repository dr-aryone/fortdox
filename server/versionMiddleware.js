const logger = require('app/logger');
const config = require('app/config');

const checkVersion = function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS' || req.path.includes('update')) {
    next();
    return;
  }

  const version = req.get('x-fortdox-version');
  if (correctVersion(version)) {
    next();
  } else {
    logger.info('version', 'Client with outdated version');
    res.set('x-fortdox-required-version', config.clientVersion);
    res.statusCode = 400;
    res.send({
      message: `Unsupported version, please use ${config.clientVersion}`
    });
    res.end();
  }
};

function correctVersion(version) {
  if (version) {
    if (version === config.clientVersion) {
      return true;
    }
  }
  return false;
}

module.exports = { checkVersion, correctVersion };
