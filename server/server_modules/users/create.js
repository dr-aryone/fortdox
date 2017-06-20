const db = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = async function (username, password) {
  let user = await db.User.findOne({where: {username: username}});

  if (user) {
    return false;
  }
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    await db.User.create({username: username, password: hash});
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
