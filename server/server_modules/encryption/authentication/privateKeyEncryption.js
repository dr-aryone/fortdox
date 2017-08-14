const aes = require('./aes');

const encryptPrivateKey = (tempPassword, privateKey) => {
  return new Promise(async (resolve, reject) => {
    let encryptedPrivateKey;
    try {
      encryptedPrivateKey = await aes.encrypt(tempPassword, privateKey);
      return resolve(encryptedPrivateKey);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};

const decryptPrivateKey = (tempPassword, encryptedPrivateKey) => {
  return new Promise(async (resolve, reject) => {
    let privateKey;
    try {
      privateKey = await aes.decrypt(tempPassword, encryptedPrivateKey);
      return resolve(privateKey);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};

module.exports = {
  encryptPrivateKey,
  decryptPrivateKey
};
