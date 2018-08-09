const permissions = require('app/permissions');
const logger = require('app/logger');
const db = require('app/models');

async function listPermissions(req, res) {
  logger.info(
    '/permissions/',
    `${req.session.email} checking what permissions exist`
  );

  let listablePermissions = Object.entries(permissions.names).filter(
    n => n[1] !== permissions.getPermissionName(permissions.BASE)
  );

  let isOwner = false;
  try {
    const email = req.session.email;
    const user = await db.User.findOne({ where: { email: email } });
    if (!user) {
      logger.error('/permissions/me', `Did not finde user ${email}`);
      return res.status(500).send();
    }
    const orgOwner = await db.Organization.findOne({
      where: { id: req.session.organizationId, owner: user.id }
    });
    isOwner = orgOwner ? true : undefined;
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  if (!isOwner)
    listablePermissions = listablePermissions.filter(
      p => p[1] !== permissions.getPermissionName(permissions.GRANT_PERMISSION)
    );

  listablePermissions = listablePermissions.reduce((result, item) => {
    result[item[0]] = item[1];
    return result;
  }, {});

  res.send(listablePermissions);
}

module.exports = listPermissions;
