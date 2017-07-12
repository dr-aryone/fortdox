const db = require('app/models');


module.exports = (interval) => {
  return new Promise(async (resolve, reject) => {
    let currentTime = new Date();
    let limit = interval * 60000;
    let inactiveOrganizations;
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
            await user.destroy();
          });
          await entry.destroy();
        } catch (error) {
          console.error(error);
          return reject(500);
        }
      }
    });
    return resolve();
  });
};
