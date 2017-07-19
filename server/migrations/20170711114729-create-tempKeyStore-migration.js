'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('TempKeys', {
      uuid: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      privateKey: {
        allowNull: false,
        type: Sequelize.BLOB
      },
      activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('TempKeys');
  }
};
