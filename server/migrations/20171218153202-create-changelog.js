'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Changelog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      elasticSearchId: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface) {
    return queryInterface.dropTable('Organizations');
  }
};
