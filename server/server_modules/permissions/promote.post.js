const logger = require('app/logger');
const permissions = require('app/permissions');
const db = require('app/models');
const expect = require('@edgeguideab/expect');

async function promote(req, res) {
  const expectations = expect(
    { email: 'string', permission: 'number' },
    req.body
  );

  if (!expectations.wereMet()) {
    logger.error(
      '/permissions/promote',
      'Client sent invalid request',
      expectations.errors()
    );
    return res
      .status(400)
      .send()
      .end();
  }

  logger.info(
    '/permissions/promote',
    `${req.session.email} is trying to promote a user to a permission manager`
  );

  const newPermission = req.body.permission;
  const newPermissionManager = req.body.email;

  if (newPermission !== permissions.GRANT_PERMISSION) {
    logger.warn(
      '/permissions/promote',
      `${
        req.session.email
      } tried to promote to an incorrect permission level ${newPermission}`
    );
    return res.status(400).send();
  }

  try {
    const userEmail = req.session.email;
    const orgJoinUser = await db.Organization.findOne({
      include: [
        {
          model: db.User,
          as: 'users',
          where: { email: userEmail }
        }
      ]
    });

    if (
      !orgJoinUser ||
      !orgJoinUser.users[0] ||
      orgJoinUser.owner != orgJoinUser.users[0].id
    ) {
      logger.warn(
        '/permission/promote',
        `${req.session.email} is not the owner of this organization`
      );

      return res.status(403).send();
    }

    logger.info(
      '/permission/promote',
      `Organization owner ${orgJoinUser.owner}:${
        orgJoinUser.users[0].email
      } will promote ${newPermissionManager} to permission manager.`
    );

    await db.User.update(
      { permission: permissions.GRANT_PERMISSION },
      { where: { email: newPermissionManager } }
    );

    return res.status(200).send();
  } catch (error) {
    logger.error(
      '/permissions/promote',
      'Could not query database for permission and owner information',
      error
    );
    return res.status(500).send();
  }
}

module.exports = promote;
