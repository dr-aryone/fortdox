const configProd = require('./config.json');
const configDev = require('./config-dev.json');
const NODE_ENV = process.env.NODE_ENV;
let config;

if (NODE_ENV || NODE_ENV === 'development') config = configDev;
else config = configProd;

module.exports = config;
