'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(module.filename);
//var config = require('app/config.json').sqlConfig;
var db = {};
var sequelize = new Sequelize('docApp', 'root', 'edgeguide', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});
loadModels(__dirname);
function loadModels(directory) {
  fs.readdirSync(directory)
    .filter(function(file) {
      return file !== basename;
    })
    .forEach(function(file) {
      if (file.indexOf('.') === -1 && file !== basename) { //It's a directory, probably
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
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
