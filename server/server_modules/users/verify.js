const db = require('../models');
const bcrypt = require('bcrypt');

module.exports = async function(username, password) {
  let hash;
  try {
    let user = await db.User.findOne({where: {username: username}});
    hash = user.password;
  } catch (error) {
    console.error(error);
    return false;
  }
  try {
    let validPassword = await bcrypt.compare(password, hash);
    return validPassword;
  } catch (error) {
    console.error(error);
    return false;
  }
};
