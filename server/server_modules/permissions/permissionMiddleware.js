const acu = require('./accessControlUnit');
const permissions = require('./index');
const db = require('app/models');
const logger = require('app/logger');

function permissionRequired(permission) {
  return async (req, res, next) => {
    const email = req.session.email;
    try {
      const user = await db.User.findOne({
        where: {
          email: email
        }
      });

      if (!user) {
        logger.warn(
          `Permission check: ${permissions.getPermissionName(permission)}`,
          `User ${email} not found`
        );
        return res.status(401).send();
      }

      logger.verbose(
        `Permission check: ${permissions.getPermissionName(permission)}`,
        `User ${user.email}, permission level ${user.permission}`
      );

      if (acu(user.permission).check(permission)) {
        logger.info(
          `Permission check: ${permissions.getPermissionName(permission)}`,
          `User ${email} granted permission to: ${permissions.getPermissionName(
            permission
          )} features`
        );
        next();
      } else {
        logger.warn(
          `Permission check: ${permissions.getPermissionName(permission)}`,
          `User ${email} tried to, ${permissions.getPermissionName(
            permission
          )}, without the correct authorization`
        );
        return res.status(403).send();
      }
    } catch (error) {
      logger.warn(
        `Permission check: ${permissions.getPermissionName(permission)}`,
        `Failed when querying database for User ${email}`
      );
      return res.status(500).send();
    }
  };
}

module.exports = permissionRequired;
