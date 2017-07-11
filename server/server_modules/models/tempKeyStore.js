module.exports = function(sequelize, DataTypes) {
  var tempKeyStore = sequelize.define('tempKeyStore', {
    uuid: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      unique: true,
      type: DataTypes.INTEGER
    },
    privateKey: {
      allowNull: false,
      type: DataTypes.BLOB
    }
  }, {
    timestamps: false
  });
  return tempKeyStore;
};
