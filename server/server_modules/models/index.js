'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
var sqlConfig = require('../config.json').sqlConfig;
const deviceLimit = require('app/utilities/deviceLimit');
var db = {};
var sequelize = new Sequelize(
  sqlConfig.database,
  sqlConfig.username,
  sqlConfig.password,
  {
    host: sqlConfig.host,
    dialect: sqlConfig.dialect,
    logging: sqlConfig.logging,
    operatorsAliases: false
  }
);
loadModels(__dirname);
function loadModels(directory) {
  fs.readdirSync(directory)
    .filter(function(file) {
      return file !== basename;
    })
    .forEach(function(file) {
      if (file.indexOf('.') === -1 && file !== basename) {
        //It's a directory, probably
        loadModels(path.resolve(directory, file));
      } else {
        var model = sequelize.import(path.join(directory, file));
        db[model.name] = model;
      }
    });
}
Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

deviceLimit.createTrigger(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
