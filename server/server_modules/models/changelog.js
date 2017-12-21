module.exports = function(sequelize, DataTypes) {
  var Changelog = sequelize.define('Changelog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:  true,
      autoIncrement: true,
      allowNull: false
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
    updatedAt: false
  });

  return Changelog;
};
