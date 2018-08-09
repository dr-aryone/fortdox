const expect = require('@edgeguideab/expect');
const logger = require('app/logger');
const db = require('app/models');
const acu = require('./accessControlUnit');
const permissions = require('app/permissions');

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

  let newPermission = req.body.permission;
  const userEmail = req.body.email;
  const adminPermissions = req.session.permission;

  let userToUpdate;
  try {
    userToUpdate = await db.User.findOne({ where: { email: userEmail } });
    if (!userToUpdate) throw new Error(`No user found with email${userEmail}`);
  } catch (error) {
    logger.error(
      '/permissions POST',
      `Could not or query db to find ${userEmail} to set permission on`
    );
    return res.status(500).send();
  }

  const userToUpdateHasGrantPermission =
    (userToUpdate.permission & permissions.GRANT_PERMISSION) ===
    permissions.GRANT_PERMISSION;

  if (userToUpdateHasGrantPermission) {
    logger.warn(
      '/permission/users',
      `${req.session.email} tried to change permissions on admin ${
        userToUpdate.email
      }`
    );
    return res.status(400).send();
  }

  if (newPermission === userToUpdate.permission) {
    logger.info(
      '/permissions POST',
      `Permission manager ${
        req.session.email
      } want to set the same permission level on user ${
        userToUpdate.email
      } that it already has.
      This is a no op.`
    );
    return res.send();
  }

  if (!acu(adminPermissions).canSet(newPermission)) {
    logger.warn(
      '/permissions POST',
      `${
        req.session.email
      } tried to grant permission ${newPermission} to ${userEmail} which is an invalid permission.`
    );
    return res.status(400).send();
  }

  try {
    const update = await db.User.update(
      { permission: newPermission },
      {
        where: {
          id: userToUpdate.id,
          email: userToUpdate.email,
          permission: userToUpdate.permission,
          organizationId: req.session.organizationId
        }
      }
    );

    if (!update[0]) {
      logger.info(
        '/permissions POST',
        `Could NOT grant permission ${newPermission} to ${userEmail}`
      );
      return res.status(400).send();
    }

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
