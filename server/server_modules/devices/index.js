const db = require('app/models');
const {
  tempEncryptPrivatekey,
  createNewMasterPassword
} = require('app/encryption/keys/cryptMasterPassword');
const logger = require('app/logger');
const mailer = require('app/mailer');

module.exports = { add, createDevice, findDeviceFromUserUUID, listDevices };

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
  const inviteCode = 'D@' + newDevice.deviceId;
  tempPassword = tempPassword.toString('base64');

  console.log('device', 'Invitecode', inviteCode, '\npwd', tempPassword);

  res.send({
    uuid: inviteCode,
    tempPassword: tempPassword
  });
  debugger;
  const mail = {
    to: req.session.email,
    subject: 'Fortdox new device',
    from: 'Fortdox',
    content: `
    <p>Invitation code:</p>
    <p>${inviteCode}</p>
    <p>Temporary password:</p>
    <p>${tempPassword}</p>`
  };

  mailer.send(mail);
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
