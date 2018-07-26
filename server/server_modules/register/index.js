const users = require('app/users');
const db = require('app/models');
const devices = require('app/devices');
const keygen = require('app/encryption/keys/keygen');
const orgs = require('app/organizations');
const es = require('app/elastic_search');
const {
  encryptMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const mailer = require('app/mailer');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const logger = require('app/logger');

module.exports = {
  organization,
  confirm,
  verify
};

async function organization(req, res) {
  logger.info('/register', 'Registering new organization');
  let uuid = uuidv1();
  let newUser = {
    email: req.body.email,
    password: null,
    organizationId: null,
    uuid
  };
  let organizationId;
  let email = req.body.email;
  try {
    await users.createUser(newUser);
    logger.info('/register', `User ${req.body.email} was created!`);
  } catch (error) {
    logger.warn('/register', `User ${req.body.email} already exists`);
    return res.status(error).send('user');
  }
  try {
    organizationId = (await orgs.createOrganization(req.body.organization)).id;
    await users.setOrganizationId({
      email,
      organizationId
    });
  } catch (error) {
    logger.error(
      '/register',
      `Could not set Organization ID (${organizationId}) for ${email}`
    );
    return res.status(error).send('organization');
  }
  let mail = mailer.firstTimeRegistration({
    to: newUser.email,
    organization: req.body.organization,
    uuid: newUser.uuid
  });

  logger.log('verbose', '/register', 'Register mail code:\n', newUser.uuid);

  try {
    mailer.send(mail);
    logger.log(
      'verbose',
      '/register',
      `User ${req.body.email} sent an activation mail for organization ${
        req.body.organization
      }`
    );
  } catch (error) {
    logger.error(
      '/register',
      `Could not send email to ${
        newUser.email
      } probably because email does not exist`
    );
    return res.status(error).send('mail');
  }
  res.send();
}

async function confirm(req, res) {
  let email = req.body.email;
  let deviceId = req.body.deviceId;
  if (!req.body.privateKey) {
    logger.warn(
      '/register/confirm',
      `Missing private key for ${email} @ /register/confirm`
    );
    return res.status(400).send();
  }
  let privateKey = Buffer.from(req.body.privateKey, 'base64');
  logger.info('/register/confirm', 'Trying to confirm registration of org');

  try {
    await users.verifyUser(email, privateKey, deviceId);
  } catch (error) {
    logger.error(
      '/register/confirm',
      `Could not verify user ${email}, possibly malformed/incorrect private key or mysql server is down`
    );
    return res.status(500).send();
  }
  let organizationName;
  try {
    organizationName = await users.getOrganizationName(email);
  } catch (error) {
    logger.error(
      '/register/confirm',
      `Could not connect user ${email} with an organization. Probable cause could be mysql server is down.`
    );
    res.status(404).send();
  }
  try {
    const organizationIndexName = uuidv4();
    await es.createIndex(organizationIndexName);
    await orgs.activateOrganization(organizationName, organizationIndexName);
    let user = await users.getUser(email);

    let deviceName = req.body.deviceName
      ? req.body.deviceName
      : 'Generic Device';

    await db.Devices.update(
      {
        activated: true,
        deviceName: deviceName
      },
      { where: { deviceId: deviceId } }
    );

    res.status(200).send({
      organizationName,
      email: user.email
    });
    logger.info(
      '/register/confirm',
      `User ${user.email} successfully created organization ${organizationName}`
    );
  } catch (error) {
    logger.error(
      '/register/confirm',
      `Check ElasticSearch and MSQL server connections. Failing that check if ${organizationName} already exists`
    );
    res.status(500).send();
  }
}

async function verify(req, res) {
  let user;
  let keypair;
  try {
    user = await users.verifyUUID(req.body.activationCode);
  } catch (error) {
    logger.warn(
      '/register/verify',
      `Could not verify User with UUID ${
        req.body.activationCode
      }. Probably because user does not exist`,
      error
    );
    return res.status(error).send();
  }
  try {
    logger.log(
      'verbose',
      '/register/verify',
      `Generating keypair for new user ${user.email}`
    );
    keypair = await keygen.genKeyPair();
  } catch (error) {
    logger.error('/register/verify', error);
  }
  let masterPassword = keygen.genRandomPassword();
  let encryptedMasterPassword = encryptMasterPassword(
    keypair.publicKey,
    masterPassword
  );

  try {
    let device = await devices.createDevice(user.id, encryptedMasterPassword);
    res.send({
      email: user.email,
      privateKey: keypair.privateKey.toString('base64'),
      deviceId: device.deviceId
    });
  } catch (error) {
    logger.error(
      '/register/verify',
      `Could not set encrypted master password for ${
        user.email
      }. Check MYSQL connection, or if ${user.email} does not exist`,
      error
    );
    res.status(500).send();
  }
}
