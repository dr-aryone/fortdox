const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = async function (username, password) {
  let user;
  try {
    user = await db.User.findOne({where: {username: username}});
  } catch (error) {
    console.error(error);
    return 500;
  }
  if (user) {
    return 409;
  }
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    await db.User.create({username: username, password: hash});
    return 200;
  } catch (error) {
    console.error(error);
    return 401;
  }
};
