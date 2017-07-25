const config = require('../config.json');

const privateKey = header => {
  let name = config.name;
  if (!header) throw 404;
  let privateKey = header.split(`${name} `)[1];
  if (privateKey === 'null') throw 400;
  try {
    privateKey = new Buffer(privateKey, 'base64').toString();
  } catch (error) {
    throw 400;
  }
  return privateKey;
};

const sessionKey = header => {
  let name = config.name;
  if (!header) throw 404;
  let privateKey = header.split(`${name} `)[1];
  if (privateKey === 'null') throw 400;
  try {
    privateKey = new Buffer(privateKey, 'base64');
  } catch (error) {
    throw 400;
  }
  return privateKey;
};

module.exports = {
  privateKey,
  sessionKey
};
