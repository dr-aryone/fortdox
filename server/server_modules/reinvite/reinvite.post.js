const expect = require('@edgeguideab/expect');
const userUtil = require('app/users/User');
const logger = require('app/logger');
const db = require('app/models');
const uuidv1 = require('uuid/v1');
const {
  createDevice,
  createPasswords,
  mailAndLog
} = require('app/invite/utilities');

async function reinvite(req, res) {
  let privateKey = req.session.privateKey;
  let senderEmail = req.session.email;
  let encryptedMasterPassword = req.session.mp;
  let sender = {
    Organization: { name: req.session.organization },
    email: senderEmail
  };

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
  if (sender.email === email) {
    logger.log('silly', 'User tried to self-invite');
    return res.status(500).send();
  }
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

  user.uuid = uuidv1();
  await db.User.update({ uuid: user.uuid }, { where: { id: user.id } });

  try {
    let {
      newEncryptedMasterPassword,
      encryptedPrivateKey,
      tempPassword
    } = await createPasswords(privateKey, encryptedMasterPassword);

    await createDevice(user, newEncryptedMasterPassword, encryptedPrivateKey);
    await mailAndLog(user, sender, tempPassword);

    return res
      .send({
        uuid: user.uuid,
        tempPassword: tempPassword.toString('base64')
      })
      .end();
  } catch (error) {
    console.error(error);
  }
  res.status(500).send();
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
    'DELETE FROM TempKeys where uuid IN (select Devices.deviceId from Devices where userid = :id)',
    { replacements: { id: user.id } }
  );
}

module.exports = reinvite;
