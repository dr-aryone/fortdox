module.exports = function(sequelize, DataTypes) {
  var Changelog = sequelize.define('Changelog', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user: {
      unique: false,
      allowNull: false,
      type: DataTypes.STRING
    },
    elasticSearchId: {
      unique: false,
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    createdAt: true
  });

  return Changelog;
};
