const crypto = require('crypto');

const encryptMasterPassword = (publicKey, masterPassword) => {
  let encryptedMasterPassword = crypto.publicEncrypt(publicKey, masterPassword);
  return encryptedMasterPassword;
};

const decryptMasterPassword = (privateKey, encryptedMasterPassword) => {
  let decryptedMasterPassword = crypto.privateDecrypt(privateKey, encryptedMasterPassword);
  return decryptedMasterPassword;

};

module.exports = {
  encryptMasterPassword,
  decryptMasterPassword
};
