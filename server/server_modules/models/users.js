var Sequelize = require('sequelize');
var db;

var users = function(sequelize) {
  db = sequelize;
  var usr = db.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING
    },
    password: {
      allowNull: false,
      type: Sequelize.BLOB
    }
  },
  {
    timestamps: false
  });
  return usr;
};

module.exports = users;
