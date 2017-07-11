'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('tempKeyStore', {
      uuid: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        unique: true,
        type: Sequelize.INTEGER
      },
      privateKey: {
        allowNull: false,
        type: Sequelize.BLOB
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('tempKeyStore');
  }
};
