const db = require('app/models');

module.exports = async organization => {
  let org;
  try {
    org = await db.Organization.findOne({where: {name: organization}});
  } catch (error) {
    console.error(error);
    throw 500;
  }
  if (!org) {
    return 200;
  }
  throw 409;
};
