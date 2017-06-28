const {spawn} = require('child_process');
const crypto = require('crypto');
const fs = require('fs');

const genKeyPair = () => {
  spawn('openssl', [
    'genrsa',
    '-out',
    'private_key.pem'
  ]);
  spawn('openssl', [
    'rsa',
    '-pubout',
    '-in',
    'private_key.pem',
    '-out',
    'public_key.pem'
  ]);
};

const genMasterPassword = () => {
  let masterPassword = crypto.randomBytes(32).toString('base64');
  fs.writeFileSync('master_password', masterPassword);
};

const encryptMasterPassword = (publicKey) => {
  debugger;
  let masterPassword = fs.readFileSync('./master_password', 'base64');
  crypto.publicEncrypt(publicKey, new Buffer(masterPassword));
};


module.exports = {genKeyPair, genMasterPassword, encryptMasterPassword};
