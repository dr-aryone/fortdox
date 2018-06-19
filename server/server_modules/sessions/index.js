const users = require('app/users');
const db = require('app/models');
const statusMsg = require('app/statusMsg.json');
const logger = require('app/logger');
const { decryptSession, encryptSession } = require('./encryption');
const {
  decryptMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');

module.exports = {
  login,
  restrict,
  needsMasterPassword,
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

  //NOTICE: This should be removed when everyone is migrated
  //This is used to let the client learn the device uuid assigned to the 'main' device.
  const requestDeviceId = req.body.deviceId;
  let deviceIdWhereQuery = {};
  let deviceIdMigration = false;
  console.log('Device id is', req.body.deviceId);
  if (requestDeviceId === undefined && user.uuid == null) {
    console.log('migration', 'Client without device uuid, will send it back.');
    deviceIdMigration = true;
    deviceIdWhereQuery = { userid: user.id };
  } else {
    console.log('migration', 'Client with device uuid');
    deviceIdWhereQuery = { deviceId: requestDeviceId };
  }

  const deviceOfUser = await db.Devices.findOne({
    where: deviceIdWhereQuery
  });

  let privateKey = Buffer.from(req.body.privateKey, 'base64');
  user.password = deviceOfUser.password;

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
    deviceId: deviceOfUser.deviceId,
    email: user.email,
    organizationId: user.Organization.id,
    organization: user.Organization.name
  });

  res.send({
    token,
    deviceId: deviceIdMigration ? deviceOfUser.deviceId : undefined
  });
  logger.log('info', `User ${req.body.email} has logged in!`);
}

async function needsMasterPassword(req, res, next) {
  const userEmail = req.session.email;
  const deviceId = req.session.deviceId;

  let user;
  try {
    user = await db.User.findOne({
      where: {
        email: userEmail
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send({ error: 'No such user' })
      .end();
  }

  let device;
  try {
    device = await db.Devices.findOne({
      where: {
        userid: user.id,
        deviceId: deviceId
      }
    });
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .send({ error: 'No such device is registered with us' })
      .end();
  }

  req.session.userid = user.id;
  req.session.mp = device.password;
  next();
}

function restrict(req, res, next) {
  let authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({
      error: 'missing authorization header'
    });
  }

  let encodedToken = authorization.split('Bearer ')[1];

  if (!encodedToken) {
    return res.status(401).send({
      error: 'no bearer token in header'
    });
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
    organization: req.session.organization,
    email: req.session.email
  });
}
