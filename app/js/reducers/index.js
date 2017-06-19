const {combineReducers} = require('redux');
const navigation = require('./navigation');
const login = require('./login');

const docApp = combineReducers({
  navigation,
  login
});


module.exports = docApp;
