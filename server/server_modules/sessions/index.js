const users = require('app/users');
const keygen = require('app/encryption/keys/keygen');
const statusMsg = require('app/statusMsg.json');
const logger = require('app/logger');
const secret = keygen.genRandomPassword();
const {decryptMasterPassword} = require('app/encryption/keys/cryptMasterPassword');
const jwt = require('jsonwebtoken');

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

  let token = jwt.sign({
    privateKey,
    email: user.email,
    organization: user.Organization.name
  }, secret);

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
    decodedToken = jwt.verify(encodedToken, secret);
  } catch (error) {
    logger.error(error);
    return res.status(401).send();
  }

  decodedToken.privateKey = Buffer.from(decodedToken.privateKey);
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
