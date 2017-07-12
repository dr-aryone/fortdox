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
const userPage = require('./userPage');

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
  userPage
});


module.exports = docApp;
