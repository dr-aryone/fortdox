const extractPrivateKey = header => {
  return new Buffer(header.split('FortDoks ')[1], 'base64').toString();
};

module.exports = extractPrivateKey;
