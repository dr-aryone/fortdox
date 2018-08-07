module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define(
    'Organization',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      activated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      indexName: {
        unique: true,
        allowNull: true,
        type: DataTypes.STRING
      },
      owner: {
        allowNull: true,
        type: DataTypes.INTEGER
      }
    },
    {
      updatedAt: false
    }
  );

  Organization.associate = function(models) {
    Organization.hasMany(models.User, {
      as: 'users',
      foreignKey: 'organizationId'
    });
    Organization.hasOne(models.User, {
      foreignKey: 'id'
    });
  };
  return Organization;
};
