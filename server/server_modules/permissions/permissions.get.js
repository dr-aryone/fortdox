const db = require('app/models');
const logger = require('app/logger');

async function readUsersAndTheirPermissions(req, res) {
  try {
    //TODO:Only users in this users organisation..
    const rows = await db.User.findAll({});

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
