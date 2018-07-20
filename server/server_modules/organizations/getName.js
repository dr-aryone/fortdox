const db = require('app/models');

module.exports = async organization => {
  let org;
  try {
    org = await db.Organization.findOne({ where: { name: organization } });
    if (!org) {
      return 200;
    }
  } catch (error) {
    console.error(error);
    throw 500;
  }
  throw 409;
};
