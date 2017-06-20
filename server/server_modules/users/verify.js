const db = require('../models');
const bcrypt = require('bcrypt');
module.exports = async function(username, password) {
  let hash = await db.User.findOne({where: {username: username}}).dataValues.password;
  try {
    let validPassword = await bcrypt.compare(password, hash);
    return validPassword;
  } catch (error) {
    console.error(error);
    return false;
  }

};
