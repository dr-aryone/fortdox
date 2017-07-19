'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organizationId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'Organizations',
          key: 'id'
        },
        onDelete: 'SET NULL'
      },
      username: {
        allowNull: true,
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.BLOB
      },
      uuid: {
        type: Sequelize.UUID,
        unique: true
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Users');
  }
};
