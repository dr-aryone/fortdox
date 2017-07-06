const db = require('app/models');

module.exports = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email
        },
        include: [db.Organization]
      });
      if (!user) {
        return reject(404);
      }
      return resolve(user.Organization.organization);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });

};
