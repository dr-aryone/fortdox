const config = require('app/config.json');
const logger = require('app/logger');
async function createTrigger(db) {
  const triggerName = 'limit_device';

  try {
    await db.query(`DROP TRIGGER IF EXISTS ${triggerName}`, {
      raw: true
    });

    await db.query(
      `
      CREATE TRIGGER ${triggerName} BEFORE INSERT ON Devices
      FOR EACH ROW 
      BEGIN
          IF ( SELECT count(*) FROM Devices WHERE userid = NEW.userid) >= :limit
          THEN
          signal sqlstate '45000';
          END IF;
      END;`,
      {
        raw: true,
        replacements: { limit: config.deviceLimit, name: triggerName }
      }
    );
  } catch (error) {
    logger.error('Add device limit trigger to database', error);
  }
}

module.exports = { createTrigger };
