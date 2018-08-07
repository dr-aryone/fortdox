const acu = require('./accessControlUnit');
const permissions = require('./index');
const db = require('app/models');
const logger = require('app/logger');

async function requiresGrantPermission(req, res, next) {
  const email = req.session.email;

  try {
    const user = await db.User.findOne({
      where: {
        email: email
      }
    });

    if (!user) {
      logger.warn(
        'Permission check: grant permission',
        `User ${email} not found`
      );
      return res.status(401).send();
    }

    logger.verbose(
      'Permission check: grant permission',
      `User ${user.email}, permission level ${user.permission}`
    );

    if (acu(user.permission, permissions.GRANT_PERMISSION)) {
      logger.info(
        'Permission check: grant permission',
        `User ${email} granted permission to: grant permission features.`
      );

      req.session.permission = user.permission;

      next();
    } else {
      logger.warn(
        'Permission check: grant permission',
        `User ${email} tried to, access grant permission features, without the correct authorization`
      );
      return res.status(403).send();
    }
  } catch (error) {
    logger.warn(
      'Permission check: grant permission',
      `Failed when querying database for User ${email}`
    );
    return res.status(500).send();
  }
}

module.exports = requiresGrantPermission;
