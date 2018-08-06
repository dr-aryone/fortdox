const expect = require('@edgeguideab/expect');
const logger = require('app/logger');
const db = require('app/models');

async function updateUserPermission(req, res) {
  const expectations = expect(
    { email: 'string', permission: 'number' },
    req.body
  );
  if (!expectations.wereMet()) {
    logger.error('/permissions POST', 'Client sent request that was invalid');
    return res
      .status(400)
      .send({
        message: 'Malformed request'
      })
      .end();
  }

  //TODO do some permission sanitation...
  const newPermission = req.body.permission;
  const userEmail = req.body.email;

  try {
    await db.User.update(
      { permission: newPermission },
      { where: { email: userEmail } }
    );
    logger.info(
      '/permissions POST',
      `Permission ${newPermission} granted to ${userEmail}`
    );
    res.send();
  } catch (error) {
    res.status(500).send();
  }
}

module.exports = updateUserPermission;
