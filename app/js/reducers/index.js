const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');
const register = require('./register');

const docApp = combineReducers({
  navigation,
  login,
  register
});


module.exports = docApp;
