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

module.exports = encryptPrivateKey;
