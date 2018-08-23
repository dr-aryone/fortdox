const db = require('app/models');
const logger = require('app/logger');
const moment = require('moment');
const TWO_HOURS = 7200000;

module.exports = async () => {
  logger.info('Running cleanup');
  const currentTime = new Date();
  const birthTimeToDelete = moment(new Date(currentTime - TWO_HOURS));
  let inactiveOrganizations;
  let tempKeysOfInactivateUsers;
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
    const createdAt = moment(entry.createdAt);
    if (createdAt.isBefore(birthTimeToDelete)) {
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
    }
  });

  try {
    await Promise.all(organizationCleanupPromises);
    tempKeysOfInactivateUsers = await db.TempKeys.findAll();
  } catch (error) {
    logger.error(error);
    throw 500;
  }

  const tempKeysDeletionPromises = tempKeysOfInactivateUsers.map(
    async tempKey => {
      const createdAt = moment(tempKey.createdAt);
      if (createdAt.isBefore(birthTimeToDelete)) {
        try {
          await tempKey.destroy();
          await db.User.destroy({
            where: {
              uuid: tempKey.uuid,
              activated: false
            }
          });
        } catch (error) {
          console.error(error);
          throw 500;
        }
      }
    }
  );
  try {
    await Promise.all(tempKeysDeletionPromises);
  } catch (error) {
    logger.error(error);
    throw 500;
  }

  let inactiveDevices;
  try {
    inactiveDevices = await db.Devices.findAll({
      where: {
        activated: false
      }
    });
  } catch (error) {
    logger.error(error);
    throw 500;
  }

  const inactiveDevicesPromises = inactiveDevices.map(async device => {
    const createdAt = moment(device.createdAt);
    if (createdAt.isBefore(birthTimeToDelete)) {
      try {
        await device.destroy();
      } catch (error) {
        logger.error(error);
      }
    }
  });

  try {
    await Promise.all(inactiveDevicesPromises);
  } catch (error) {
    logger.error(error);
    throw 500;
  }
};
