const db = require('app/models');


const getUser = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email: email
        },
        include: [db.Organization]
      });
      return resolve(user);
    } catch (error) {
      console.error(error);
      return reject(500);
    }
  });
};


const getOrganizationName = email => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await getUser(email);
    } catch (error) {
      console.error(error);
      reject(500);
    }
    return resolve(user.Organization.name);
  });
};


module.exports = {
  getOrganizationName,
  getUser
};
