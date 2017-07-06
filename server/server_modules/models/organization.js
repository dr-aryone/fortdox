module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define('Organization', {
    id : {
      type: DataTypes.INTEGER,
      primaryKey:  true,
      autoIncrement: true
    },
    organization: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
  });

  Organization.associate = function(models) {
    Organization.hasMany(models.User, {
      as: 'users',
      foreignKey: 'organizationId'
    });
  };
  return Organization;
};
