'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Users', 'permission', {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'permission');
  }
};
