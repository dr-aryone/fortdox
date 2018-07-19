'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Organizations', 'indexName', {
      type: Sequelize.STRING,
      unique: true
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      'ALTER TABLE Organizations DROP COLUMN indexName'
    );
  }
};
