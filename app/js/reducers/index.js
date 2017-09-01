const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');
const register = require('./register');
const search = require('./search');
const createDocument = require('./createDocument');
const updateDocument = require('./updateDocument');
const user = require('./user');
const invite = require('./invite');
const verifyUser = require('./verifyUser');
const download = require('./download');
const toast = require('./toast');
const organization = require('./organization');

const docApp = combineReducers({
  navigation,
  login,
  register,
  user,
  search,
  createDocument,
  updateDocument,
  invite,
  verifyUser,
  download,
  toast,
  organization
});


module.exports = docApp;
