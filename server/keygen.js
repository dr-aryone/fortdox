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
  console.log(masterPassword);
  let writeFileAsync = promisify(fs.writeFile);
  try {
    writeFileAsync('master_password', masterPassword);
  } catch (error) {
    console.log(error);
  }
};

const encryptMasterPassword = async publicKey => {
  let readFileAsync = promisify(fs.readFile);
  let masterPassword;
  let privateKey;
  try {
    masterPassword = await readFileAsync('./master_password');
    privateKey = await readFileAsync('./private_key.pem', 'utf-8');
  } catch (error) {
    console.log(error);
  }

  let encryptedData = crypto.publicEncrypt(publicKey, masterPassword);
  let decryptedData = crypto.privateDecrypt(privateKey, encryptedData);

  console.log(encryptedData);
  console.log(decryptedData);

};


module.exports = {genKeyPair, genMasterPassword, encryptMasterPassword};
