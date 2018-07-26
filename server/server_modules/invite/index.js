const users = require('app/users');
const devices = require('app/devices');
const {
  decryptPrivateKey
} = require('app/encryption/authentication/privateKeyEncryption');

const { createPasswords, createDevice, mailAndLog } = require('./utilities');
const uuidv1 = require('uuid/v1');
const logger = require('app/logger');

module.exports = {
  user,
  confirm,
  verify
};

async function user(req, res) {
  let privateKey = req.session.privateKey;
  let email = req.session.email;
  let organizationId = req.session.organizationId;
  let newUserEmail = req.body.newUserEmail;
  let encryptedMasterPassword = req.session.mp;
  let sender;

  logger.info('/invite', 'User:', email, 'invited', newUserEmail);

  try {
    sender = await users.getUser(email);
  } catch (error) {
    logger.warn('/invite', `Could not find sender ${email}`);
    return res.status(409).send();
  }

  if (sender.email === newUserEmail) {
    logger.warn('/invite', 'User tried to self-invite', email);
    return res.status(500).send();
  }

  let uuid = uuidv1();
  let newUser = {
    email: newUserEmail,
    organizationId,
    uuid
  };

  try {
    newUser = await users.createUser(newUser);
  } catch (error) {
    logger.error(
      '/invite',
      'Could not create user',
      newUser.email,
      'because of',
      error
    );
    return res.status(500).send({ error: 'Internatl Server Error' });
  }

  try {
    let {
      newEncryptedMasterPassword,
      encryptedPrivateKey,
      tempPassword
    } = await createPasswords(privateKey, encryptedMasterPassword);

    await createDevice(
      newUser,
      newEncryptedMasterPassword,
      encryptedPrivateKey
    );
    await mailAndLog(newUser, sender, tempPassword);

    return res
      .send({
        uuid: uuid,
        tempPassword: tempPassword.toString('base64')
      })
      .end();
  } catch (error) {
    logger.error('/invite', error);
  }
  res.status(500).send();
}

async function verify(req, res) {
  let uuid = req.body.uuid;
  let tempPassword = Buffer.from(
    decodeURIComponent(req.body.temporaryPassword),
    'base64'
  );
  let encryptedPrivateKey;
  let privateKey;

  logger.info('/invite/verify', 'Verifying invitecode', uuid);

  try {
    encryptedPrivateKey = new Buffer(
      await users.getEncryptedPrivateKey(uuid),
      'base64'
    );
    privateKey = (await decryptPrivateKey(
      tempPassword,
      encryptedPrivateKey
    )).toString('base64');

    let device = await devices.findDeviceFromUserUUID(uuid);

    res.send({
      privateKey,
      deviceId: device.deviceId
    });

    logger.log(
      'verbose',
      '/invite/verify',
      `Keypair generated and private key was sent to user with UUID ${uuid}`
    );

    return;
  } catch (error) {
    logger.log('error', `Could not find user with UUID ${uuid}`);
    return res
      .status(500)
      .send()
      .end();
  }
}

async function confirm(req, res) {
  let uuid = req.body.uuid;
  const deviceId = req.body.deviceId;

  logger.info('/invite/confirm', 'Confirming invite', uuid, deviceId);

  if (!req.body.privateKey) {
    logger.warn(
      '/invite/verify',
      `Missing private key for ${uuid} when confirming uuid`
    );
    return res.status(400).send();
  }

  let privateKey = Buffer.from(req.body.privateKey, 'base64');

  let metadata;
  let deviceName = req.body.deviceName ? req.body.deviceName : 'Generic Device';
  try {
    metadata = await users.verifyNewUser(
      deviceId,
      deviceName,
      uuid,
      privateKey
    );
    await users.TempKeys.remove(uuid);
    res.send(metadata);
    logger.info(
      '/invite/confirm',
      `User ${metadata.email} was added to ${metadata.organization}`
    );
  } catch (error) {
    logger.error('/invite/confirm', `Cannot verify User with uuid ${uuid}`);
    return res.status(500).send();
  }
}
