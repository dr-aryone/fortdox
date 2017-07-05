'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organization: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Organizations');
  }
};
