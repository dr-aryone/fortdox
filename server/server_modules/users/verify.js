const db = require('../models');
const bcrypt = require('bcrypt');

module.exports = function(username, password) {
  return new Promise(async (resolve, reject) => {
    let hash;
    let user;
    try {
      user = await db.User.findOne({where: {username: username}});
      if (!user) {
        return reject(404);
      }
      hash = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    try {
      let result = await bcrypt.compare(password, hash);
      return result ? resolve(200) : reject(401);
    } catch (error) {
      console.error(error);
      return reject(401);
    }
  });
};
