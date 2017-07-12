const db = require('app/models');

module.exports = uuid => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.TempKeys.findOne({
        where: {
          uuid
        }
      });
      if (!user) {
        return reject(404);
      }
      return resolve(user.privateKey);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });

};
