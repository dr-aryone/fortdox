/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*
  This code was adapted from https://github.com/mozilla/node-client-sessions
  by: Anton Lövmar
*/

const crypto = require('crypto');
const moment = require('moment');
const logger = require('app/logger');
const encryptionKey = crypto.randomBytes(32);
const signatureKey = crypto.randomBytes(32);
const cipherType = 'aes-256-cbc';
const BLOCK_SIZE_BYTES = 16;
const SESSION_DURATION = moment.duration(30, 'days').valueOf();

module.exports = {
  decryptSession,
  encryptSession
};

function encryptSession(content) {
  if (typeof content === 'object') {
    content = JSON.stringify(content);
  }
  content = Buffer.from(content);

  let initVector = crypto.randomBytes(BLOCK_SIZE_BYTES);
  let cipher = crypto.createCipheriv(cipherType, encryptionKey, initVector);

  let cipherTextStart = cipher.update(content);
  let cipherTextEnd = cipher.final();
  let cipherText = Buffer.concat([initVector, cipherTextStart, cipherTextEnd]);
  zeroBuffer(content); //Clear plaintext in memory
  zeroBuffer(cipherTextStart);
  zeroBuffer(cipherTextEnd);
  zeroBuffer(initVector);

  let duration = SESSION_DURATION;
  let createdAt = moment().valueOf();
  let signature = computeHmac(cipherText, duration, createdAt);

  let result = [
    base64Encode(cipherText),
    duration,
    createdAt,
    base64Encode(signature),
  ].join('.');
  return result;
}

function decryptSession(content) {
  let parts = content.split('.');

  let cipherText = parts[0];
  let duration = parts[1];
  let createdAt = parts[2];
  let signature = parts[3];

  if (!cipherText) {
    clean();
    throw new Error('Missing cipher text');
  }

  if (!signature) {
    clean();
    throw new Error('Missing signature');
  }

  signature = base64Decode(signature);
  cipherText = base64Decode(cipherText);

  let expectedSignature = computeHmac(cipherText, duration, createdAt);
  if (!constantTimeEquals(signature, expectedSignature)) {
    clean();
    throw new Error('Invalid signature');
  }

  let initVector = cipherText.slice(0, BLOCK_SIZE_BYTES);
  cipherText = cipherText.slice(BLOCK_SIZE_BYTES);
  let cipher = crypto.createDecipheriv(cipherType, encryptionKey, initVector);
  let plainText;
  try {
    plainText = cipher.update(cipherText, null, 'utf8');
    plainText += cipher.final('utf8');
  } catch (error) {
    logger.error(error);
    clean();
    throw new Error('invalid encryption key');
  }

  let now = moment();
  let limit = moment(parseInt(createdAt) + parseInt(duration));

  if (now.isAfter(limit)) {
    throw new Error('session time expired');
  }

  try {
    plainText = JSON.parse(plainText);
    clean();
    return plainText;
  } catch (error) {
    logger.error(error);
    clean();
    throw new Error('failed to parse session contents to json');
  }

  function clean() {
    zeroBuffer(signature);
    zeroBuffer(cipherText);
  }
}

function zeroBuffer(buf) {
  if (!buf) {
    return null;
  }
  for (var i = 0; i < buf.length; i++) {
    buf[i] = 0;
  }
  return buf;
}

function constantTimeEquals(a, b) {
  // Ideally this would be a native function, so it's less sensitive to how the
  // JS engine might optimize.
  if (a.length !== b.length) {
    return false;
  }
  var ret = 0;
  for (var i = 0; i < a.length; i++) {
    ret |= a.readUInt8(i) ^ b.readUInt8(i);
  }
  return ret === 0;
}

function computeHmac(ciphertext, duration, createdAt) {
  let hmac = crypto.createHmac('sha512', signatureKey);

  hmac.update(ciphertext);
  hmac.update('.');
  hmac.update(createdAt.toString());
  hmac.update('.');
  hmac.update(duration.toString());

  return hmac.digest();
}

function base64Encode(content) {
  return Buffer.from(content).toString('base64');
}

function base64Decode(content) {
  return Buffer.from(content, 'base64');
}
