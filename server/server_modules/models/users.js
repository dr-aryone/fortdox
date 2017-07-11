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
      allowNull: true,
      type: DataTypes.STRING
    },
    email: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: true,
      type: DataTypes.BLOB
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    timestamps: false
  });
  User.associate = (models) => {
    User.belongsTo(models.Organization);
  };
  return User;
};
