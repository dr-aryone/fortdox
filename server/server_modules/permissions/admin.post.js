const logger = require('app/logger');
const permissions = require('app/permissions');
const db = require('app/models');
const expect = require('@edgeguideab/expect');

async function promote(req, res) {
  const expectations = expect({ email: 'string' }, req.body);

  if (!expectations.wereMet()) {
    logger.error(
      '/permissions/admin',
      'Client sent invalid request',
      expectations.errors()
    );
    return res
      .status(400)
      .send()
      .end();
  }

  const newAdmin = req.body.email;

  logger.info(
    '/permissions/admin',
    `${req.session.email} is trying to promote ${newAdmin} to a admin`
  );

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
        '/permission/admin',
        `${req.session.email} is not the owner of this organization`
      );

      return res.status(403).send();
    }

    logger.info(
      '/permission/admin',
      `Organization owner ${orgJoinUser.owner}:${
        orgJoinUser.users[0].email
      } will promote ${newAdmin} to admin.`
    );

    const maxPermission =
      permissions.GRANT_PERMISSION |
      permissions.DELETE_DOCUMENT |
      permissions.INVITE_USER |
      permissions.REMOVE_USER;

    await db.User.update(
      { permission: maxPermission },
      { where: { email: newAdmin } }
    );

    return res.status(200).send();
  } catch (error) {
    logger.error(
      '/permissions/admin',
      'Could not query database for permission and owner information',
      error
    );
    return res.status(500).send();
  }
}

module.exports = promote;
