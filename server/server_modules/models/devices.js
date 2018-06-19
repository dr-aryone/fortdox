'use strict';
module.exports = function(sequelize, DataTypes) {
  var Devices = sequelize.define('Devices', {
    userid: {
      allowNull: false,
      type: DataTypes.INTEGER,
      autoIncrement: false,
      primaryKey: true
    },
    deviceId: {
      allowNull: false,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4
    },
    password: {
      allowNull: true,
      type: DataTypes.BLOB
    },
    deviceName: { type: DataTypes.STRING },
    activated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  Devices.associate = models => {
    Devices.belongsTo(models.User, { foreignKey: 'userid' });
  };

  return Devices;
};
