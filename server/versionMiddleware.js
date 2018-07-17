const config = require('app/config');
const checkVersion = function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    next();
    return;
  }

  const version = req.get('x-fortdox-version');

  if (correctVersion(version)) {
    next();
  } else {
    res.set('x-fortdox-required-version', config.clientVersion);
    res.statusCode = 400;
    res.send({
      message: `Unsported version, please use ${config.clientVersion}`
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
