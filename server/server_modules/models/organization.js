var Sequelize = require('sequelize');
var db;

var users = function(sequelize) {
  db = sequelize;
  var usr = db.define('Organization', {
    id : {
      type: Sequelize.INTEGER,
      primaryKey:  true,
      autoIncrement: true
    },
    organization: {
      unique: true,
      allowNull: false,
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  });
  return usr;
};

module.exports = users;
