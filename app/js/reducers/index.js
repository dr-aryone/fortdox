const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');
const register = require('./register');
const form = require('./form');
const search = require('./search');

const docApp = combineReducers({
  navigation,
  login,
  register,
  form,
  search
});


module.exports = docApp;
