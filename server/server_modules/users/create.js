const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function (username, password) {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({where: {username: username}});
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    if (user) {
      return reject(409);
    }
    try {
      let hash = await bcrypt.hash(password, saltRounds);
      await db.User.create({username: username, password: hash});
      return resolve(200);
    } catch (error) {
      console.error(error);
      return reject(401);
    }
  });

};
