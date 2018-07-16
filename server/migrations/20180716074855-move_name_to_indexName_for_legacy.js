'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query(
      `UPDATE Organizations dest, (SELECT id,name FROM Organizations) src
      SET dest.indexName = LOWER(src.name) where dest.id = src.id;`
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.sequelize.query('UPDATE organizations SET indexName = \'\'');
  }
};
