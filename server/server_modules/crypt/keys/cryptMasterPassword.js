const crypto = require('crypto');
const fs = require('fs');
const {promisify} = require('util');


const encryptMasterPassword = async () => {
  let readFileAsync = promisify(fs.readFile);
  let writeFileAsync = promisify(fs.writeFile);
  let masterPassword;
  let publicKey;
  try {
    publicKey = await readFileAsync('./public_key.pem', 'utf-8');
    masterPassword = await readFileAsync('./master_password');
    masterPassword = Buffer.from(masterPassword.toString(), 'base64');
  } catch (error) {
    console.log(error);
  }
  let encryptedMasterPassword = crypto.publicEncrypt(publicKey, masterPassword).toString('base64');
  try {
    await writeFileAsync('./encrypted_master_password', encryptedMasterPassword);
  } catch (error) {
    console.error(error);
    return;
  }
};

const decryptMasterPassword = (privateKey) => {
  return new Promise(async (resolve, reject) => {
    let readFileAsync = promisify(fs.readFile);
    let encryptedMasterPassword;
    let decryptedMasterPassword;
    try {
      encryptedMasterPassword = await readFileAsync('./encrypted_master_password');
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
