const aes = window.require('./aes.js');
const fs = window.require('fs');

const encryptPrivateKey = async (privateKey, password) => {
  let result;
  try {
    result = await aes.generatePaddedKey(password);
  } catch (error) {
    console.error(error);
    return {
      status: false,
      errorMsg: 'MEEP'
    };
  }
  let encryptedKey;
  try {
    encryptedKey = (await aes.encrypt(new window.Buffer(result.key, 'base64'), new window.Buffer(privateKey, 'base64')));
  } catch (error) {
    console.error(error);
    return {
      status: false,
      errorMsg: 'Meep meep'
    };
  }
  fs.writeFileSync('./js/local_storage/encryptedPrivateKey', encryptedKey.toString('base64'));
  fs.writeFileSync('./js/local_storage/salt', result.salt.toString('base64'));
  return {
    status: true,
    errorMsg: null
  };
};

module.exports = encryptPrivateKey;
