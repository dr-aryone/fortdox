const db = require('../models');
const bcrypt = require('bcrypt');

module.exports = async function(username, password) {
  let hash;
  let user;
  try {
    user = await db.User.findOne({where: {username: username}});
    if (!user) {
      return 404;
    }
    hash = user.password;
  } catch (error) {
    console.error(error);
    return 500;
  }
  try {
    let res = await bcrypt.compare(password, hash);
    return res ? 200 : 401;
  } catch (error) {
    console.error(error);
    return 401;
  }

};
