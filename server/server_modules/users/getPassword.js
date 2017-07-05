const db = require('app/models');

module.exports = function (email) {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({where: {email: email}});
      let password = user.password;
      return resolve(password);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};
