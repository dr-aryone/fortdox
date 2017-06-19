const {combineReducers} = require('redux');
const login = require('./login');

const docApp = combineReducers({
  login
});

module.exports = docApp;
