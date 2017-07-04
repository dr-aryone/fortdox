const crypto = require('crypto');
const fs = require('fs');
const {promisify} = require('util');


const encryptMasterPassword = (publicKey, masterPassword) => {
  let encryptedMasterPassword = crypto.publicEncrypt(publicKey, masterPassword).toString('base64');
  return encryptedMasterPassword;
};

const decryptMasterPassword = (privateKey) => {
  return new Promise(async (resolve, reject) => {
    let readFileAsync = promisify(fs.readFile);
    let encryptedMasterPassword;
    let decryptedMasterPassword;
    try {
      encryptedMasterPassword = await readFileAsync('./server_modules/crypt/keys/temp_keys/encrypted_master_password');
      encryptedMasterPassword = Buffer.from(encryptedMasterPassword.toString(), 'base64');
      decryptedMasterPassword = crypto.privateDecrypt(privateKey, encryptedMasterPassword);
      return resolve(decryptedMasterPassword);
    } catch (error) {
      console.error(error);
      return reject(500);
    }

  });
};

module.exports = {
  encryptMasterPassword,
  decryptMasterPassword
};
