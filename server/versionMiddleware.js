const config = require('app/config');
const checkVersion = function(req, res, next) {
  if (req.method.toUpperCase() === 'OPTIONS') {
    next();
    return;
  }

  const version = req.get('X-FORTDOX-VERSION');

  if (correctVersion(version)) {
    next();
  } else {
    res.set('X-FORTDOX-REQUIRED-VERSION', config.clientVersion);
    res.statusCode = 400;
    res.send({
      message: `
The version of your client is no longer supported, please update to ${
  config.clientVersion
}.
    If you need help please contact the FortDox developers.`
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
