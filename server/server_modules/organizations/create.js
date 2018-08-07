const db = require('app/models');

module.exports = (organization, owner) => {
  return new Promise(async (resolve, reject) => {
    try {
      let [org, created] = await db.Organization.findOrCreate({
        where: { name: organization },
        defaults: { owner: owner }
      });
      if (!created) {
        return reject(409);
      }
      return resolve(org);
    } catch (error) {
      console.error(error);
    }
    return reject(500);
  });
};
