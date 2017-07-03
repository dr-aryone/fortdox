const cryptMP = require('../keys/cryptMasterPassword.js');
const aes = require('./aes');

const encryptDocument = async (data, privateKey) => {
  try {
    let masterPassword = await cryptMP.decryptMasterPassword(privateKey);
    let encryptedData = await aes.encrypt(masterPassword, data);
    return encryptedData;
  } catch (error) {
    console.error(error);
    return;
  }
};

const decryptDocuments = (encryptedDataList, privateKey) => {
  return new Promise(async (resolve, reject) => {
    let masterPassword;
    try {
      masterPassword = await cryptMP.decryptMasterPassword(privateKey);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    encryptedDataList.map((entry) => {
      entry._source.text = aes.decrypt(masterPassword, new Buffer(entry._source.text, 'base64')).toString();
    });

    return resolve(encryptedDataList);
  });
};

module.exports = {encryptDocument, decryptDocuments};
