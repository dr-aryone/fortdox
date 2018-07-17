const checkVersion = function(req, res, next) {};

function correctVersion(req) {
  const header = req.headers['X-FORTDOX-VERSION'];
  console.log(header);
  if (header) {
    const version = header.version;
    if (version) {
      return true;
    }
  }
  return false;
}

module.exports = { checkVersion, correctVersion };
