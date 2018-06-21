const crypto = require('crypto');
const keygen = require('app/encryption/keys/keygen');
const {
  encryptPrivateKey
} = require('app/encryption/authentication/privateKeyEncryption');
const logger = require('app/logger');

const encryptMasterPassword = (publicKey, masterPassword) => {
  let encryptedMasterPassword = crypto.publicEncrypt(publicKey, masterPassword);
  return encryptedMasterPassword;
};

const decryptMasterPassword = (privateKey, encryptedMasterPassword) => {
  let decryptedMasterPassword = crypto.privateDecrypt(
    privateKey,
    encryptedMasterPassword
  );
  return decryptedMasterPassword;
};

async function createNewMasterPassword(privateKey, encryptedMasterPassword) {
  let keypair = await keygen.genKeyPair();
  let masterPassword = decryptMasterPassword(
    privateKey,
    encryptedMasterPassword
  );
  let newEncryptedMasterPassword = encryptMasterPassword(
    keypair.publicKey,
    masterPassword
  );
  return { keypair, newEncryptedMasterPassword };
}

async function tempEncryptPrivatekey(privateKey) {
  let tempPassword = keygen.genRandomPassword();
  let encryptedPrivateKey;
  try {
    encryptedPrivateKey = await encryptPrivateKey(tempPassword, privateKey);
    return { tempPassword, encryptedPrivateKey };
  } catch (error) {
    logger.log(
      'error',
      `Cannot encrypt prviatekey w temp password @ /invite or /devices/add. \n ${error}`
    );
  }
}

module.exports = {
  encryptMasterPassword,
  decryptMasterPassword,
  createNewMasterPassword,
  tempEncryptPrivatekey
};
