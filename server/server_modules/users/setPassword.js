const db = require('app/models');

module.exports = function ({email, organizationId}, password) {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email,
          organizationId: organizationId,
        }
      });
      if (!user) {
        return reject(404);
      }
      await user.updateAttributes({password: password});
      return resolve();
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};
