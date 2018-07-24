const users = require('app/users');
const db = require('app/models');
const statusMsg = require('app/statusMsg.json');
const logger = require('app/logger');
const { decryptSession, encryptSession } = require('./encryption');
const { isObjEmpty } = require('./isEmpty');
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
    logger.warn('/login', 'No existing user ' + req.body.email);
    return res.status(error).send();
  }

  //NOTICE: This should be removed when everyone is migrated
  //This is used to let the client learn the device uuid assigned to the 'main' device.
  const requestDeviceId = req.body.deviceId;
  let deviceIdWhereQuery = {};
  let deviceIdMigration = false;
  logger.log('verbose', '/login', 'Device id is', req.body.deviceId);
  if (requestDeviceId === undefined && user.uuid == null) {
    logger.log(
      'verbose',
      '/login',
      'Migration:- Client without device uuid, will send it back.'
    );
    deviceIdMigration = true;
    deviceIdWhereQuery = { userid: user.id };
  } else {
    logger.log('verbose', '/login', 'Migration:- Client with device uuid');
    deviceIdWhereQuery = { deviceId: requestDeviceId };
  }

  let deviceOfUser;
  try {
    deviceOfUser = await db.Devices.findOne({
      where: deviceIdWhereQuery
    });
  } catch (error) {
    logger.error('/login', 'Could not query db for device', error);
    return res.status(500).send();
  }

  if (!deviceOfUser) {
    logger.warn('/login', 'No existing device with id' + req.body.deviceId);
    return res.status(404).send();
  }

  let privateKey = Buffer.from(req.body.privateKey, 'base64');
  user.password = deviceOfUser.password;

  try {
    await decryptMasterPassword(privateKey, user.password);
  } catch (error) {
    logger.error(
      '/login',
      `Failed to decrypt master password for user ${user.email}`,
      error
    );
    return res.status(401).send({
      msg: statusMsg.user[401]
    });
  }

  let token = encryptSession({
    privateKey: privateKey.toString('base64'),
    deviceId: deviceOfUser.deviceId,
    email: user.email,
    organizationId: user.Organization.id,
    organization: user.Organization.name,
    organizationIndex: user.Organization.indexName
  });

  res.send({
    token,
    deviceId: deviceIdMigration ? deviceOfUser.deviceId : undefined
  });
  logger.info('/login', `User ${req.body.email} has logged in!`);
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
    logger.error('auth/needsMasterPassword', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }

  if (!user) {
    logger.warn('auth/needsMasterPassword', 'No user with email {userEmail}');
    return res.status(401).send({ error: 'Unauthorized' });
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
    logger.error('auth/needsMasterPassword', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }

  if (!device) {
    logger.warn('auth', `No device with id ${deviceId} and user id ${user.id}`);
    return res.status(401).send({ error: 'Unauthorized.' });
  }

  req.session.userid = user.id;
  req.session.mp = device.password;
  next();
}

async function restrict(req, res, next) {
  let authorization = req.headers.authorization;
  if (!authorization) {
    logger.warn('auth/restrict', 'No Header');
    return res.status(401).send({
      error: 'Unauthorized.'
    });
  }

  let encodedToken = authorization.split('Bearer ')[1];

  if (!encodedToken) {
    logger.warn('auth/restrict', 'No token');
    return res
      .status(401)
      .send({
        error: 'Unauthorized.'
      })
      .end();
  }

  let decodedToken;

  try {
    decodedToken = decryptSession(encodedToken);
  } catch (error) {
    logger.warn('auth/restrict', 'Invalid session', error);
    return res.status(401).send({
      error: 'Session Expired.'
    });
  }
  try {
    let device = await db.Devices.findOne({
      where: {
        deviceId: decodedToken.deviceId
      }
    });
    if (!device) {
      throw Error('Could not find device that matches this users deviceId');
    }
  } catch (error) {
    logger.error('auth/restrict', 'Could not query DB for device', error);
    return res
      .status(401)
      .send({
        error: 'Unauthorized.'
      })
      .end();
  }

  decodedToken.privateKey = Buffer.from(decodedToken.privateKey, 'base64');
  req.session = decodedToken;

  if (isObjEmpty(decodedToken)) {
    logger.warn('auth/restric', 'Parts of token is empty', decodedToken);
    return res.status(401).send({
      error: 'Session invalid'
    });
  }

  next();
}

function check(req, res) {
  logger.info('/login/check', `${req.session.user} has valid token`);
  res.send({
    organization: req.session.organization,
    email: req.session.email
  });
}
