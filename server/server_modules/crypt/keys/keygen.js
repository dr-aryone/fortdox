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

const genMasterPassword = async () => {
  let masterPassword = crypto.randomBytes(32).toString('base64');
  let writeFileAsync = promisify(fs.writeFile);
  try {
    await writeFileAsync('master_password', masterPassword);
  } catch (error) {
    console.log(error);
  }
};




module.exports = {genKeyPair, genMasterPassword};
