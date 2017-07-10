const db = require('app/models');

module.exports = function ({username, email, password, organizationId, uuid}) {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.User.findOne({
        where: {
          email
        },
        include: [db.Organization]
      });
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    if (user) {
      return reject(409);
    }
    try {
      await db.User.create({
        username: username,
        email: email,
        password: password,
        organizationId: organizationId,
        uuid: uuid
      });
      return resolve(201);
    } catch (error) {
      console.error(error);
      return reject(401);
    }
  });

};
