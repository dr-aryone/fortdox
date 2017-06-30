const keygen = require('./keygen');

const verifyPrivateKey = async privateKey => {
  try {
    await keygen.decryptMasterPassword(privateKey);
    return 200;
  } catch (error) {
    console.error(error);
    return 404;
  }
};

module.exports = verifyPrivateKey;
