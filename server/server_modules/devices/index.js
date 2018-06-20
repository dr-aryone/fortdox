const db = require('app/models');
const {
  tempEncryptPrivatekey,
  createNewMasterPassword,
  decryptMasterPassword
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
  deleteDevice,
  verify,
  confirm,
  updateName
};

async function updateName(req, res) {
  let deviceIdToUpdate = req.body.deviceId;
  let deviceName = req.body.deviceName;

  try {
    let user = await db.User.findOne({
      where: {
        email: req.session.email
      }
    });
    await db.Devices.update(
      { name: deviceName },
      {
        where: {
          deviceId: deviceIdToUpdate,
          userid: user.id
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Could not update name of device' });
  }
  res.status(200).send();
}

async function deleteDevice(req, res) {
  const deviceIdToDelete = req.params.deviceId;
  debugger;
  let user = await db.User.findOne({
    where: {
      email: req.session.email
    }
  });

  try {
    await db.Devices.destroy({
      where: {
        userid: user.id,
        deviceId: deviceIdToDelete
      }
    });

    await db.TempKeys.destroy({
      where: {
        uuid: deviceIdToDelete
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: 'Could not delete device'
    });
  }

  res.send();
}

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
    req.body.temporaryPassword === undefined ||
    req.body.temporaryPassword === null
  ) {
    res.status(400).send({ error: 'Malformed request' });
  }

  const inviteCode = req.body.uuid;
  const uuid = inviteCode.slice(1);

  let tempPassword = req.body.temporaryPassword;
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

async function confirm(req, res) {
  if (
    req.body.uuid === undefined ||
    req.body.uuid == null ||
    req.body.deviceId === undefined ||
    req.body.deviceId === null ||
    req.body.privateKey === undefined ||
    req.body.privateKey === null
  ) {
    res.status(400).send({ error: 'Malformed request' });
  }

  const inviteCode = req.body.uuid;
  const uuid = inviteCode.slice(1);
  const deviceId = req.body.deviceId;
  const privateKey = Buffer.from(req.body.privateKey, 'base64');

  //verifyNewDevice
  const deviceJoinUser = await db.Devices.findOne({
    where: { deviceId: deviceId },
    include: [{ model: db.User }]
  });
  const device = await db.Devices.findOne({
    where: { deviceId: deviceId, userid: deviceJoinUser.User.id }
  });

  const org = await db.Organization.findOne({
    where: { id: deviceJoinUser.User.organizationId }
  });

  const encryptedMasterPassword = device.password;
  //check to see that it works...
  decryptMasterPassword(privateKey, encryptedMasterPassword);

  await db.TempKeys.destroy({
    where: {
      uuid: deviceId
    }
  }).catch(error => {
    console.error(error);
    return res.status(500).send({
      error: 'Something wentr terribly wrong, we are working hard to fix it'
    });
  });

  //set device as activated
  db.Devices.update(
    {
      activated: true
    },
    { where: { deviceId: deviceId } }
  );

  res.status(200).send({
    email: deviceJoinUser.User.email,
    organization: org.name
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
