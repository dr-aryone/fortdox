const db = require('app/models');
const logger = require('app/logger');
const es = require('app/elastic_search');
const THIRTY_MINUTES = 1800000;

module.exports = async () => {
  logger.silly('Running cleanup');
  const currentTime = new Date();
  const birthTimeToDelete = new Date(currentTime - THIRTY_MINUTES);
  let inactiveOrganizations;
  let tempKeysOfInActivateUsers;
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
  const organizationCleanupPromises = inactiveOrganizations.map(async entry => {
    if (entry.createdAt < birthTimeToDelete) {
      try {
        let users = await db.User.findAll({
          where: {
            organizationId: entry.id
          }
        });
        const userPromises = users.map(async user => {
          await db.TempKeys.destroy({
            where: {
              uuid: user.uuid
            }
          });
          await user.destroy();
        });
        await Promise.all(userPromises);
        await entry.destroy();
      } catch (error) {
        console.error(error);
        throw 500;
      }
      try {
        await es.deleteIndex(entry.name);
      } catch (error) {
        console.error(error);
        throw 404;
      }
    }
  });

  try {
    await Promise.all(organizationCleanupPromises);
    tempKeysOfInActivateUsers = await db.TempKeys.findAll({
      where: {
        activated: false
      }
    });
  } catch (error) {
    logger.error(error);
    throw 500;
  }

  const tempKeysDeletionPromises = tempKeysOfInActivateUsers.map(
    async tempKey => {
      if (tempKey.createdAt < birthTimeToDelete) {
        return;
      }
      try {
        await tempKey.destroy();
        await db.User.destroy({
          where: {
            uuid: tempKey.uuid
          }
        });
      } catch (error) {
        console.error(error);
        throw 500;
      }
    }
  );
  try {
    await Promise.all(tempKeysDeletionPromises);
  } catch (error) {
    logger.error(error);
    throw 500;
  }

  const inactiveDevices = await db.Devices.findAll({
    where: {
      activated: false
    }
  });

  inactiveDevices.map(async inactiveDevice => {
    await inactiveDevice.destroy();
  });
};
