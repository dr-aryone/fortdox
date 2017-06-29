const crypto = require('crypto');
const cipherType = 'aes-256-cbc';
const BLOCK_SIZE_BYTES = 16;

module.exports = {
  encrypt,
  decrypt
};

async function encrypt({password, message}) {
  let initVector;
  message = Buffer.from(message);
  try {
    initVector = await randomBuffer(BLOCK_SIZE_BYTES);
  } catch (error) {
    return error;
  }
  let cipher = crypto.createCipheriv(cipherType, password, initVector);
  let encrypted = cipher.update(message, null, 'base64');
  encrypted += cipher.final('base64');
  let encryptedBuffer = Buffer.from(encrypted, 'base64');
  encryptedBuffer = Buffer.concat([initVector, encryptedBuffer]);
  return encryptedBuffer;
}

function decrypt({password, message}) {
  let initVector = message.slice(0, BLOCK_SIZE_BYTES);
  message = message.slice(BLOCK_SIZE_BYTES);
  let cipher = crypto.createDecipheriv(cipherType, password, initVector);
  let decrypted = cipher.update(message, null, 'base64');
  decrypted += cipher.final('base64');
  let decryptedBuffer = Buffer.from(decrypted, 'base64');
  return decryptedBuffer;
}

function randomBuffer(bytes) {
  return new Promise(function(resolve, reject) {
    crypto.randomBytes(bytes, (err, buf) => {
      if (err) {
        return reject(err);
      }
      resolve(buf);
    });
  });
}
