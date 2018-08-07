const db = require('app/models');
const logger = require('app/logger');

async function readUsersAndTheirPermissions(req, res) {
  try {
    const rows = await db.User.findAll({
      where: {
        organizationId: req.session.organizationId
      }
    });

    const usersAndPermissions = rows.map(user => {
      return {
        email: user.email,
        permission: user.permission
      };
    });
    return res.send(usersAndPermissions);
  } catch (error) {
    logger.error(
      '/permissions',
      'Could not get users and their permissions',
      error
    );
    res.status(500).send();
  }
}

module.exports = readUsersAndTheirPermissions;
