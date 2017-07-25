const moment = require('moment');
const stillAlive = sessionStart => {
  return moment(sessionStart).isAfter(moment().subtract(1,'m'));
};

module.exports = {stillAlive};
