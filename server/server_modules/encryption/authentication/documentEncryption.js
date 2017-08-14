const cryptMP = require('../keys/cryptMasterPassword.js');
const aes = require('./aes');

const encryptDocument = (encryptedTexts, privateKey, encryptedMasterPassword) => {
  return new Promise(async (resolve, reject) => {
    let masterPassword;
    try {
      masterPassword = await cryptMP.decryptMasterPassword(privateKey, encryptedMasterPassword);
    } catch (error) {
      return reject(400);
    }
    try {
      for (let textField of encryptedTexts) {
        let text = await aes.encrypt(masterPassword, textField.text);
        textField.text = text.toString('base64');
      }
      return resolve(encryptedTexts);
    } catch (error) {
      console.error(error);
      return reject(409);
    }
  });
};

const decryptDocuments = (encryptedTexts, privateKey, encryptedMasterPassword) => {
  return new Promise(async (resolve, reject) => {
    let masterPassword;
    try {
      masterPassword = await cryptMP.decryptMasterPassword(privateKey, encryptedMasterPassword);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    try {
      for (let textField of encryptedTexts) {
        let text = await aes.decrypt(masterPassword, Buffer.from(textField.text, 'base64'));
        textField.text = text.toString();
      }
      return resolve(encryptedTexts);
    } catch (error) {
      reject(500);
    }
  });
};

module.exports = {encryptDocument, decryptDocuments};
