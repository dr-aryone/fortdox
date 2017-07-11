'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TempKeys', {
      uuid: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      privateKey: {
        allowNull: false,
        type: Sequelize.BLOB
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('TempKeys');
  }
};
