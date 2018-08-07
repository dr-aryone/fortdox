const permissions = require('app/permissions');
const logger = require('app/logger');

function listPermissions(req, res) {
  logger.info(
    '/permissions/',
    `${req.session.email} checking what permissions exist`
  );
  res.send(permissions.names);
}

module.exports = listPermissions;
