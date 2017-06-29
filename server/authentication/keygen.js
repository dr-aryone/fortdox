const {spawn} = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const {promisify} = require('util');

const genKeyPair = () => {
  return new Promise(async (resolve, reject) => {
    try {
      await genPrivateKey();
      await genPublicKey();
      resolve();
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

const genPrivateKey = () => {
  return new Promise((resolve, reject) => {
    const openssl = spawn('openssl', [
      'genrsa',
      '-out',
      'private_key.pem',
      '4096'
    ]);
    openssl.on('close', exitCode => {
      exitCode === 0 ? resolve() : reject('Failed generating private key.');
    });
  });
};

const genPublicKey = () => {
  return new Promise((resolve, reject) => {
    const openssl = spawn('openssl', [
      'rsa',
      '-pubout',
      '-in',
      'private_key.pem',
      '-out',
      'public_key.pem'
    ]);
    openssl.on('close', exitCode => {
      exitCode === 0 ? resolve() : reject('Failed generating public key.');
    });
  });
};

const genMasterPassword = () => {
  let masterPassword = crypto.randomBytes(32).toString('base64');
  let writeFileAsync = promisify(fs.writeFile);
  try {
    writeFileAsync('master_password', masterPassword);
  } catch (error) {
    console.log(error);
  }
};

const encryptMasterPassword = async publicKey => {
  let readFileAsync = promisify(fs.readFile);
  let writeFileAsync = promisify(fs.writeFile);
  let masterPassword;
  try {
    masterPassword = await readFileAsync('./master_password');
  } catch (error) {
    console.log(error);
  }

  let encryptedData = crypto.publicEncrypt(publicKey, masterPassword).toString('base64');
  try {
    writeFileAsync('./encrypted_master_password', encryptedData);
  } catch (error) {
    console.error(error);
    return;
  }
};

const decryptMasterPassword = async (privateKey) => {
  let readFileAsync = promisify(fs.readFile);
  let encryptedMasterPassword;
  try {
    encryptedMasterPassword = await readFileAsync('./encrypted_master_password');

  } catch (error) {
    console.error(error);
    return;
  }
  console.log(privateKey);
  console.log(encryptedMasterPassword);
  return crypto.privateDecrypt(privateKey, encryptedMasterPassword);

};


module.exports = {genKeyPair, genMasterPassword, encryptMasterPassword, decryptMasterPassword};
