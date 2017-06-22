const db = require('../models');
const bcrypt = require('bcrypt');

module.exports = async function(username, password) {
  let hash;
  let user;
  try {
    user = await db.User.findOne({where: {username: username}});
    hash = user.password;
  } catch (error) {
    console.error(error);
    return 500;
  }
  if (user === undefined) {
    return 404;
  }
  try {
    await bcrypt.compare(password, hash);
    return 200;
  } catch (error) {
    console.error(error);
    return 401;
  }

};
