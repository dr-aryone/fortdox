const db = require('app/models');

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
  let device = await createDevice();
  res.status(200).send(device);
}

async function listDevices(req, res) {
  let devices = await db.Devices.find({
    where: {
      email: req.session.email
    },
    include: [db.User]
  });

  res.send(devices);
}
