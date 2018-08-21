'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('Organizations', 'owner', {
      allowNull: true,
      type: Sequelize.INTEGER,
      onDelete: 'SET NULL',
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  },

  down(queryInterface) {
    return queryInterface.removeColumn('Organizations', 'owner');
  }
};
