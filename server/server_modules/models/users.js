var Sequelize = require('sequelize');
var db;

var users = function(sequelize) {
  db = sequelize;
  var usr = db.define('User', {
    id : {
      type: Sequelize.INTEGER,
      primaryKey:  true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    password: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  });
  return usr;
};

module.exports = users;
