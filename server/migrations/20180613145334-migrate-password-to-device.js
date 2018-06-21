'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(
      `INSERT INTO Devices (userid,deviceId,password,deviceName,activated,createdAt,updatedAt)
       SELECT id,uuid(),password,'default-device',true,now(),now() FROM Users;
      `
    );
  },

  down: function(queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.bulkDelete('devices');
  }
};
