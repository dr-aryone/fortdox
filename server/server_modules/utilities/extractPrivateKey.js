const config = require('../config.json');

const extractPrivateKey = header => {
  let name = config.name;
  if (!header) throw 404;
  let privateKey;
  try {
    privateKey = new Buffer(header.split(`${name} `)[1], 'base64').toString();
  } catch (error) {
    throw 400;
  }
  return privateKey;
};

module.exports = extractPrivateKey;
