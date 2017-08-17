const users = require('app/users');
const statusMsg = require('app/statusMsg.json');
const logger = require('app/logger');
const {decryptSession, encryptSession} = require('./encryption');
const {decryptMasterPassword} = require('app/encryption/keys/cryptMasterPassword');

module.exports = {
  login,
  restrict,
  check
};

async function login(req, res) {
  let user;
  try {
    user = await users.getUser(req.body.email);
  } catch (error) {
    logger.log('silly', '/login: No existing user ' + req.body.email);
    return res.status(error).send();
  }

  let privateKey = Buffer.from(req.body.privateKey, 'base64');

  try {
    await decryptMasterPassword(privateKey, user.password);
  } catch (error) {
    logger.error(error);
    logger.error(`Failed to decrypt master password for user ${user.email}`);
    return res.status(401).send({
      msg: statusMsg.user[401]
    });
  }

  let token = encryptSession({
    privateKey: privateKey.toString('base64'),
    email: user.email,
    organization: user.Organization.name
  });

  res.send({
    token
  });
  logger.log('info', `User ${req.body.email} has logged in!`);
}

function restrict(req, res, next) {
  let authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send();
  }

  let encodedToken = authorization.split('Bearer ')[1];

  if (!encodedToken) {
    return res.status(401).send();
  }

  let decodedToken;

  try {
    decodedToken = decryptSession(encodedToken);
  } catch (error) {
    logger.info('Invalid session');
    logger.error(error);
    return res.status(401).send({
      error: 'sessionExpired'
    });
  }

  decodedToken.privateKey = Buffer.from(decodedToken.privateKey, 'base64');
  req.session = decodedToken;
  next();
}

function check(req, res) {
  res.send({
    msg: 'Supplied JWT was accepted',
    organization: req.session.organization,
    email: req.session.email
  });
}
