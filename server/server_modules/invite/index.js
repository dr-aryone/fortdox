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
  try {
    sender = await users.getUser(email);
  } catch (error) {
    logger.log('silly', `Could not find sender ${email} @ /invite`);
    return res.status(409).send();
  }

  if (sender.email === newUserEmail) {
    logger.log('silly', 'User tried to self-invite');
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
    logger.log(
      'silly',
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
    console.error(error);
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
      'silly',
      `Keypair generated and private key was sent to user with UUID ${uuid}`
    );

    return;
  } catch (error) {
    logger.log('error', `Could not find user with UUID ${uuid}`);
    return res.status(500).send();
  }
}

async function confirm(req, res) {
  let uuid = req.body.uuid;
  const deviceId = req.body.deviceId;

  if (!req.body.privateKey) {
    logger.log(
      'silly',
      `Missing private key for ${uuid} when confirming uuid @ /invite/confirm`
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
    logger.log(
      'info',
      `User ${metadata.email} was added to ${metadata.organization}`
    );
  } catch (error) {
    logger.log(
      'error',
      `Cannot verify User with uuid ${uuid} @ /invite/confirm`
    );
    return res.status(500).send();
  }
}
