const keygen = require('./keygen');
const aes = require('./aes');


const encryptDocument = async (data, privateKey) => {
  try {
    let masterPassword = await keygen.decryptMasterPassword(privateKey);
    return await aes.encrypt(data, masterPassword).toString('base64');
  } catch (error) {
    console.error(error);
    return;
  }
};

module.exports = encryptDocument;
