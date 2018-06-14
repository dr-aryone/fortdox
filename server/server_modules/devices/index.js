const db = require('app/models');

module.exports = { add, createDevice };

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
