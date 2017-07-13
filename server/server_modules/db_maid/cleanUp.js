const db = require('app/models');


module.exports = (interval) => {
  return new Promise(async (resolve, reject) => {
    let currentTime = new Date();
    let limit = interval * 60000;
    let inactiveOrganizations;
    let notActivatedUsers;
    try {
      inactiveOrganizations = await db.Organization.findAll({
        where: {
          activated: false
        }
      });
    } catch (error) {
      console.error(error);
      return reject(404);
    }
    inactiveOrganizations.map(async (entry) => {
      if (entry.createdAt < new Date(currentTime - limit)) {
        try {
          let users = await db.User.findAll({
            where: {
              organizationId: entry.id
            }
          });
          users.map(async (user) => {
            db.TempKeys.destroy({
              where: {
                uuid: user.uuid
              }
            });
            await user.destroy();
          });
          await entry.destroy();
        } catch (error) {
          console.error(error);
          return reject(500);
        }
      }
    });

    try {
      notActivatedUsers = await db.TempKeys.findAll({
        where: {
          activated: false
        }
      });
    } catch (error) {
      console.error(error);
      return reject(500);
    }

    notActivatedUsers.map(async (user) => {
      if (user.createdAt < new Date(currentTime - limit)) {
        try {
          await user.destroy();
        } catch (error) {
          console.error(error);
          return reject(500);
        }
      }
    });
    return resolve();
  });
};
