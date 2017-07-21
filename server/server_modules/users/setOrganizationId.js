const db = require('app/models');

module.exports = function ({email, organizationId}) {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email
        }
      });
      if (!user) {
        return reject(404);
      }
      await user.updateAttributes({
        organizationId: organizationId
      });
      return resolve();
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};
