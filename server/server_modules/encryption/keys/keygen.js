const {spawn} = require('child_process');
const crypto = require('crypto');


const genKeyPair = () => {
  return new Promise((resolve, reject) => {
    let keypair = {};
    const genPrivateKey = spawn('openssl', [
      'genrsa',
      '4096'
    ]);
    const genPublicKey = spawn('openssl', [
      'rsa',
      '-pubout'
    ]);

    genPrivateKey.stdout.on('data', data => {
      keypair.privateKey = data;
      genPublicKey.stdin.write(data);
    });

    genPublicKey.stdout.on('data', data => {
      keypair.publicKey = data;
    });

    genPublicKey.on('close', exitCode => {
      exitCode === 0 ? resolve(keypair) : reject('Failed generating public key.');
    });

    genPrivateKey.on('close', exitCode => {
      exitCode === 0 ? null : reject('Failed generating private key.');
    });
  });
};

const genRandomPassword = () => {
  let masterPassword = crypto.randomBytes(32);
  return masterPassword;
};


module.exports = {genKeyPair, genRandomPassword};
