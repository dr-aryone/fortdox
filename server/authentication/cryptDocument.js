const keygen = require('./keygen');
const aes = require('./aes');


const encryptDocument = async (data, privateKey) => {
  try {
    let masterPassword = await keygen.decryptMasterPassword(privateKey);
    let encryptedData = await aes.encrypt({password: masterPassword, message: data});
    return encryptedData;
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = encryptDocument;
