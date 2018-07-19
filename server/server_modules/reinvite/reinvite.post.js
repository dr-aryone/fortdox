const expect = require('@edgeguideab/expect');
const userUtil = require('app/users/User');
const logger = require('app/logger');
const db = require('app/models');

async function reinvite(req, res) {
  const expectations = expect(
    {
      reinvite_email: 'string'
    },
    req.body
  );

  if (!expectations.wereMet()) {
    return res
      .status(400)
      .send({
        message: 'Malformed request'
      })
      .end();
  }
  const email = req.body.reinvite_email;
  let user;
  try {
    user = await userUtil.getUser(email);
    await clearTempkeys(user);
    await deleteDevices(user);
  } catch (error) {
    logger.info('reinvite', error);
    return res
      .status(500)
      .send()
      .end();
  }

  //Do invite flow again

  res.send('Hello World');
}

async function deleteDevices(user) {
  return await db.Devices.destroy({
    where: {
      userid: user.id
    }
  });
}

async function clearTempkeys(user) {
  return await db.sequelize.query(
    `
    DELETE FROM TempKeys
    where uuid 
    IN (select Devices.deviceId from Devices where userid = :id)
`,
    { replacements: { id: user.id } }
  );
}

module.exports = reinvite;
