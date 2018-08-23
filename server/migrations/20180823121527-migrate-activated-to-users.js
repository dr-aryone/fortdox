'use strict';

module.exports = {
  up: async function(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TempKeys', 'activated');
    await queryInterface.addColumn('Users', 'activated', {
      allowNull: false,
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
    await queryInterface.sequelize.query(
      'UPDATE Users SET activated = true WHERE uuid IS NULL;'
    );
  },

  down: async function(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'activated');
    await queryInterface.addColumn('TempKeys', 'activated', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  }
};
