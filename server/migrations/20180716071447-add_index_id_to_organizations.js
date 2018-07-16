'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('Organizations', 'indexName', {
      type: Sequelize.STRING,
      unique: true
    });
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Organizations', 'indexName');
  }
};
