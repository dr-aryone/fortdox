const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');
const register = require('./register');
const form = require('./form');

const docApp = combineReducers({
  navigation,
  login,
  register,
  form
});


module.exports = docApp;
