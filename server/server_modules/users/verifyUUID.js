const db = require('app/models');

module.exports = function(uuid) {
  let result;
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {uuid: uuid}
      });
      if (!user) {
        return reject(404);
      }
      result = {
        email: user.email,
        organizationId: user.organizationId
      };

    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);

  });
};
