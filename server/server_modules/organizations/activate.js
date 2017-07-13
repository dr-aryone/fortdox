const db = require('app/models');

module.exports = organization => {
  return new Promise(async (resolve, reject) => {
    let org;
    try {
      org = await db.Organization.findOne({
        where: {
          organization: organization,
          activated: false
        }
      });
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    if (!org) {
      return reject(409);
    }

    try {
      await org.updateAttributes({activated: true});
      return resolve();
    } catch (error) {
      console.error(error);
      return reject(500);
    }


  });
};
