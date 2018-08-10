module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      organizationId: {
        type: DataTypes.INTEGER,
        onDelete: 'SET NULL'
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      uuid: {
        type: DataTypes.UUID,
        unique: true
      },
      permission: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      timestamps: false
    }
  );
  User.associate = models => {
    User.belongsTo(models.Organization, { foreignKey: 'organizationId' });

    User.hasMany(models.Devices, { foreignKey: 'userid' });
  };
  return User;
};
