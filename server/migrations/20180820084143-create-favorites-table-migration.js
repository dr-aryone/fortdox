'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface
      .createTable('Favorites', {
        userid: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        elasticSearchId: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: false
        }
      })
      .then(() =>
        queryInterface.addConstraint(
          'Favorites',
          ['userid', 'elasticSearchId'],
          {
            type: 'primary key',
            name: 'favoritesPrimary'
          }
        )
      );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Favorites');
  }
};
