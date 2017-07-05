module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    organizationId: {
      type: DataTypes.INTEGER
    },
    username: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.BLOB
    }
  }, {
    timestamps: false
  });
  User.associate = (models) => {
    User.belongsTo(models.Organization);
  };
  return User;
};
