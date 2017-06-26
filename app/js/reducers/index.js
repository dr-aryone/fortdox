const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');
const register = require('./register');
const search = require('./search');
const createDocument = require('./createDocument');
const updateDocument = require('./updateDocument');

const docApp = combineReducers({
  navigation,
  login,
  register,
  search,
  createDocument,
  updateDocument
});


module.exports = docApp;
