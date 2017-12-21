module.exports = function(sequelize, DataTypes) {
  var Changelog = sequelize.define('Changelog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:  true,
      autoIncrement: true
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
