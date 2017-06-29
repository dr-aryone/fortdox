const keygen = require('./keygen');
const aes = require('./aes');

const encryptDocument = async (data, privateKey) => {
  try {
    let masterPassword = await keygen.decryptMasterPassword(privateKey);
    let encryptedData = await aes.encrypt(masterPassword, data);
    return encryptedData;
  } catch (error) {
    console.error(error);
    return;
  }
};

const decryptDocument = async (encryptedDataList, privateKey) => {
  let masterPassword;
  try {
    masterPassword = await keygen.decryptMasterPassword(privateKey);
  } catch (error) {
    console.error(error);
  }
  encryptedDataList.map((entry) => {
    entry._source.text = aes.decrypt(masterPassword, new Buffer(entry._source.text, 'base64')).toString();
  });
  return encryptedDataList;
};

module.exports = {encryptDocument, decryptDocument};
