const checkVersion = function(req, res, next) {};

function correctVersion(req) {
  console.log(req.headers['X-FORTDOX-VERSION']);
  if (req.headers['X-FORTDOX-VERSION']) {
    return true;
  } else {
    return false;
  }
}

module.exports = { checkVersion, correctVersion };
