const db = require('app/models');

module.exports = async function ({email, organizationId}, password) {
  let user;
  try {
    user = await db.User.findOne({
      where: {
        email: email,
        organizationId: organizationId,
      }
    });
    if (!user) {
      throw 404;
    }
    await user.updateAttributes({
      password: password
    });
    return;
  } catch (error) {
    console.error(error);
    throw 500;
  }
};
