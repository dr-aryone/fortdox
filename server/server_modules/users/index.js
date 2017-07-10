const createUser = require('./create.js');
const verifyUser = require('./verify.js');
const getOrganization = require('./getOrganization.js');
const getPassword = require('./getPassword.js');
const verifyUUID = require('./verifyUUID.js');
const setPassword = require('./setPassword.js');
module.exports = {
  createUser,
  verifyUser,
  getPassword,
  getOrganization,
  verifyUUID,
  setPassword
};
