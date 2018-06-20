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
const logger = require('app/logger');

module.exports = {
  organization,
  confirm,
  verify
};

async function organization(req, res) {
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
    await orgs.getName(req.body.organization);
  } catch (error) {
    logger.log('silly', `Organization ${req.body.organization} already exists`);
    return res.status(error).send('organization');
  }
  try {
    await users.createUser(newUser);
    logger.log('silly', `User ${req.body.email} was created!`);
  } catch (error) {
    logger.log('silly', `User ${req.body.email} already exists`);
    return res.status(error).send('user');
  }
  try {
    organizationId = (await orgs.createOrganization(req.body.organization)).id;
    await users.setOrganizationId({
      email,
      organizationId
    });
  } catch (error) {
    logger.log(
      'error',
      `Could not set Organization ID (${organizationId}) for ${email}`
    );
    return res.status(error).send('organization');
  }
  let mail = mailer.firstTimeRegistration({
    to: newUser.email,
    organization: req.body.organization,
    uuid: newUser.uuid
  });

  logger.log('silly', 'Register mail code:\n', newUser.uuid);

  try {
    mailer.send(mail);
    logger.log(
      'silly',
      `User ${req.body.email} sent an activation mail for organization ${
        req.body.organization
      }`
    );
  } catch (error) {
    logger.log(
      'silly',
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
    logger.log('silly', `Missing private key for ${email} @ /register/confirm`);
    return res.status(400).send();
  }
  let privateKey = Buffer.from(req.body.privateKey, 'base64');

  try {
    await users.verifyUser(email, privateKey, deviceId);
  } catch (error) {
    logger.log(
      'error',
      `Could not verify user ${email}, possibly malformed/incorrect private key or mysql server is down`
    );
    return res.status(500).send();
  }
  let organizationName;
  try {
    organizationName = await users.getOrganizationName(email);
  } catch (error) {
    logger.log(
      'silly',
      `Could not connect user ${email} with an organization. Probable cause could be mysql server is down.`
    );
    res.status(404).send();
  }
  try {
    await es.createIndex(organizationName);
    await orgs.activateOrganization(organizationName);
    let user = await users.getUser(email);

    await db.Devices.update(
      { activated: true },
      { where: { deviceId: deviceId } }
    );

    res.status(200).send({
      organizationName,
      email: user.email
    });
    logger.log(
      'info',
      `User ${user.email} successfully created organization ${organizationName}`
    );
  } catch (error) {
    logger.log(
      'error',
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
    console.log(error);
    logger.warn(
      `Could not verify User with UUID ${
        req.body.activationCode
      }. Probably because user does not exist or server is down.`
    );
    return res.status(error).send();
  }
  try {
    logger.silly(`Generating keypair for new user ${user.email}`);
    keypair = await keygen.genKeyPair();
  } catch (error) {
    logger.error(error);
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
    console.error(error);
    logger.log(
      'error',
      `Could not set encrypted master password for ${
        user.email
      }. Check MYSQL connection, or if ${user.email} does not exist`
    );
    res.status(500).send();
  }
}
