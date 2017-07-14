const aes = window.require('./aes.js');

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
    return resolve({
      'privateKey': encryptedKey.toString('base64'),
      'salt': result.salt.toString('base64')
    });
  });
};

module.exports = encryptPrivateKey;
