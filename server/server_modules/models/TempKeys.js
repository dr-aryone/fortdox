module.exports = function(sequelize, DataTypes) {
  var TempKeys = sequelize.define('TempKeys', {
    uuid: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.STRING
    },
    privateKey: {
      allowNull: false,
      type: DataTypes.BLOB
    },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },{
    updatedAt: false
  });
  return TempKeys;
};
