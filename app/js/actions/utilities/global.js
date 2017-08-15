const querystring = window.require('querystring');

module.exports = {
  getAppGlobals
};

function getAppGlobals(field) {
  let globalData = querystring.parse(window.location.search);
  if (field) {
    return globalData[field];
  }
  return globalData;
}
