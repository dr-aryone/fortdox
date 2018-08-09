const permissions = require('app/permissions');
const logger = require('app/logger');

function listPermissions(req, res) {
  logger.info(
    '/permissions/',
    `${req.session.email} checking what permissions exist`
  );

  let listablePermissions = Object.entries(permissions.names).filter(
    n => n[1] !== permissions.getPermissionName(permissions.BASE)
  );

  listablePermissions = listablePermissions.reduce((result, item) => {
    result[item[0]] = item[1];
    return result;
  }, {});

  res.send(listablePermissions);
}

module.exports = listPermissions;
