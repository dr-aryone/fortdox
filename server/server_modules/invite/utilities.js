const {
  tempEncryptPrivatekey,
  createNewMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const devices = require('app/devices');
const mailer = require('app/mailer');
const users = require('app/users');
const logger = require('app/logger');

async function createPasswords(privateKey, encryptedMasterPassword) {
  let { keypair, newEncryptedMasterPassword } = await createNewMasterPassword(
    privateKey,
    encryptedMasterPassword
  );

  let tempPassword, encryptedPrivateKey;
  try {
    ({ tempPassword, encryptedPrivateKey } = await tempEncryptPrivatekey(
      keypair.privateKey
    ));
  } catch (error) {
    console.error(error);
    throw error;
  }

  return { tempPassword, newEncryptedMasterPassword, encryptedPrivateKey };
}

async function createDevice(
  newUser,
  newEncryptedMasterPassword,
  encryptedPrivateKey
) {
  try {
    await devices.createDevice(newUser.id, newEncryptedMasterPassword);
    await users.TempKeys.store(newUser.uuid, encryptedPrivateKey);
    logger.log(
      'info',
      `User ${newUser.email} was created and given the UUID ${newUser.uuid}`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function mailAndLog(newUser, sender, tempPassword) {
  let mail = mailer.newUserRegistration({
    to: newUser.email,
    organization: sender.Organization.name,
    from: sender.email,
    uuid: newUser.uuid,
    tempPassword: tempPassword.toString('base64')
  });

  logger.log(
    'silly',
    'Invite mail code:\n',
    newUser.uuid,
    '\npwd\n',
    tempPassword.toString('base64')
  );
  try {
    await mailer.send(mail);
    logger.log(
      'info',
      `User ${sender.email} invited ${newUser.email} to join ${
        sender.Organization.name
      }`
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = { createPasswords, createDevice, mailAndLog };
