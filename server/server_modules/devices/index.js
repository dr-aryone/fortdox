const db = require('app/models');
const {
  tempEncryptPrivatekey,
  createNewMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const logger = require('app/logger');
const mailer = require('app/mailer');
const users = require('app/users');
const {
  decryptPrivateKey
} = require('app/encryption/authentication/privateKeyEncryption');

module.exports = {
  add,
  createDevice,
  findDeviceFromUserUUID,
  listDevices,
  verify
};

async function findDeviceFromUserUUID(uuid) {
  let user = await db.User.findOne({
    where: {
      uuid: uuid
    }
  });

  return await db.Devices.findOne({ where: { userid: user.id } });
}

async function createDevice(forUserId, password, name = 'master-device') {
  return await db.Devices.create({
    userid: forUserId,
    deviceName: name,
    password: password
  });
}

async function add(req, res) {
  let userid = req.session.userid;
  let privatekey = req.session.privateKey;
  let encryptedMasterPassword = req.session.mp;
  let { keypair, newEncryptedMasterPassword } = await createNewMasterPassword(
    privatekey,
    encryptedMasterPassword
  );

  let { tempPassword, encryptedPrivateKey } = await tempEncryptPrivatekey(
    keypair.privateKey
  ).catch(error => {
    console.error(error);
    return res.status(500).send({ error: 'Nah, we cant do that today..' });
  });
  const newDevice = await createDevice(userid, newEncryptedMasterPassword);
  await db.TempKeys.create({
    uuid: newDevice.deviceId,
    privateKey: encryptedPrivateKey
  }).catch(error => {
    console.error('silly', 'Could not create tempkeys');
    console.error(error);
  });
  const inviteCode = '@' + newDevice.deviceId;
  tempPassword = tempPassword.toString('base64');

  console.log('device', 'Invitecode', inviteCode, '\npwd', tempPassword);
  res.send({
    uuid: inviteCode,
    tempPassword: tempPassword
  });

  const mail = mailer.newDeviceRegistration({
    to: req.session.email,
    uuid: inviteCode,
    tempPassword: tempPassword
  });

  mailer.send(mail);
  console.log('Mail away!');
}

async function verify(req, res) {
  if (
    req.body.uuid === undefined ||
    req.body.uuid == null ||
    req.body.tempPassword === undefined ||
    req.body.tempPassword === null
  ) {
    res.status(400).send({ error: 'Malformed request' });
  }

  const inviteCode = req.body.uuid;
  const uuid = inviteCode.slice(1);

  let tempPassword = req.body.password;
  tempPassword = Buffer.from(decodeURIComponent(tempPassword), 'base64');

  let privateKey;
  try {
    const encryptedPrivateKey = new Buffer(
      await users.getEncryptedPrivateKey(uuid),
      'base64'
    );
    privateKey = (await decryptPrivateKey(
      tempPassword,
      encryptedPrivateKey
    )).toString('base64');
  } catch (error) {
    logger.log(
      'error',
      error,
      'Could not find encryptedPrivatekey in TempKeys'
    );
    return res.status(error).send();
  }

  const newDevice = await db.Devices.findOne({
    where: { deviceId: uuid }
  }).catch(error => {
    console.error('Trying verify deviceid with invitation code', error);
    return res.status(error).send();
  });

  res.send({
    privateKey,
    deviceId: newDevice.deviceId
  });
}

async function listDevices(req, res) {
  let devices = await db.Devices.findAll({
    include: [
      {
        model: db.User,
        where: { email: req.session.email }
      }
    ]
  });

  const result = {
    devices: devices.map(device => {
      return {
        name: device.deviceName,
        id: device.deviceId
      };
    })
  };

  res.send(result);
}
