const db = require('app/models');

module.exports = async (interval) => {
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
    throw 404;
  }
  inactiveOrganizations.forEach(async (entry) => {
    if (entry.createdAt < new Date(currentTime - limit)) {
      try {
        let users = await db.User.findAll({
          where: {
            organizationId: entry.id
          }
        });
        users.forEach(async (user) => {
          await db.TempKeys.destroy({
            where: {
              uuid: user.uuid
            }
          });
          await db.Users.destroy();
        });
        await entry.destroy();
      } catch (error) {
        console.error(error);
        throw 500;
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
    throw 500;
  }

  notActivatedUsers.forEach(async (user) => {
    if (user.createdAt < new Date(currentTime - limit)) {
      try {
        await user.destroy();
        await db.User.destroy({
          where: {
            uuid: user.uuid
          }
        });
      } catch (error) {
        console.error(error);
        throw 500;
      }
    }
  });
  return;
};
