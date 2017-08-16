const users = require('app/users');
const keygen = require('app/encryption/keys/keygen');
const statusMsg = require('app/statusMsg.json');
const {encryptPrivateKey} = require('app/encryption/authentication/privateKeyEncryption');
const {decryptPrivateKey} = require('app/encryption/authentication/privateKeyEncryption');
const extract = require('app/utilities/extract');
const sessions = require('app/utilities/session');
const logger = require('app/logger');
const moment = require('moment');
const secret = keygen.genRandomPassword();
const {decryptMasterPassword} = require('app/encryption/keys/cryptMasterPassword');

module.exports = {
  login,
  check
};

async function login (req, res) {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    logger.log('silly', '/login: No existing user ' + req.body.email);
    return res.status(error).send();
  }
  let privateKey;
  try {
    privateKey = extract.privateKey(req.headers.authorization);
  } catch (error) {
    logger.log('info', 'No content in header Authorization');
    return res.status(400).send();
  }
  let objToStore = {
    privateKey,
    sessionStart: moment()
  };
  try {
    await decryptMasterPassword(privateKey, user.password);
    objToStore = (await encryptPrivateKey(secret, JSON.stringify(objToStore))).toString('base64');
    res.send({
      email: user.email,
      objToStore
    });
    logger.log('info', `User ${req.body.email} has logged in!`);
    return;
  } catch (error) {
    logger.log('silly', `Encrypting LocalStorage object failed for user ${req.body.email}`);
    return res.status(401).send({
      message: statusMsg.user[401]
    });
  }
}

async function check(req, res) {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    logger.log('silly', '/login/session: No existing user ' + req.body.email);
    return res.status(error).send();
  }
  let session;
  try {
    session = extract.sessionKey(req.headers.authorization);
    session = JSON.parse(await decryptPrivateKey(secret, session));
  } catch (error) {
    logger.log('silly', 'Probably failed because secret was updated or session expired/was never initiated');
    return res.status(401).send({
      message: statusMsg.session[401]
    });
  }
  if (!sessions.stillAlive(session.sessionStart)) {
    logger.log('silly', 'Session expired for ' + req.body.email);
    return res.status(401).send({
      message: statusMsg.session[401]
    });
  }
  try {
    await decryptMasterPassword(session.privateKey, user.password);
    res.send({
      email: user.email,
      privateKey: Buffer.from(session.privateKey).toString('base64')
    });
    logger.log('info', `User ${req.body.email} logged in via session!`);
    return;
  } catch (error) {
    logger.log('error', 'Could not decrypt master password for ' + req.body.email);
    return res.status(401).send({
      message: statusMsg.session[401]
    });
  }
}
