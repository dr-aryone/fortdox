'use strict';
module.exports = function(sequelize, DataTypes) {
  var Favorites = sequelize.define(
    'Favorites',
    {
      userid: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER
      },
      elasticSearchId: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    }
  );

  Favorites.associate = models => {
    Favorites.belongsTo(models.User, { foreignKey: 'userid' });
  };

  Favorites.removeAttribute('id');

  return Favorites;
};
