const aes = window.require('./aes.js');
const fs = window.require('fs');

const encryptPrivateKey = (privateKey, password) => {
  return new Promise(async (resolve, reject) => {
    let result;
    try {
      result = await aes.generatePaddedKey(password);
    } catch (error) {
      console.error(error);
      return reject('MEEP');
    }
    let encryptedKey;
    try {
      encryptedKey = (await aes.encrypt(new window.Buffer(result.key, 'base64'), new window.Buffer(privateKey, 'base64')));
    } catch (error) {
      console.error(error);
      return reject('MEEP MEEEP');
    }

    fs.writeFileSync(window.__dirname + '/local_storage/encryptedPrivateKey', encryptedKey.toString('base64'));
    fs.writeFileSync(window.__dirname + '/local_storage/salt', result.salt.toString('base64'));
    return resolve();
  });
};

module.exports = encryptPrivateKey;
