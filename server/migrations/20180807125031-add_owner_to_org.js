'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Organizations', 'owner', {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Organizations', 'owner');
  }
};
