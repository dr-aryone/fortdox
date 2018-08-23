const configProd = require('./config.json');
const NODE_ENV = process.env.NODE_ENV;
let config;

if (NODE_ENV && NODE_ENV === 'development')
  config = require('./config-dev.json');
else config = configProd;

module.exports = config;
