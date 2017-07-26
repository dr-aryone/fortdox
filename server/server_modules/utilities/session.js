const moment = require('moment');
const stillAlive = sessionStart => {
  return moment(sessionStart).isAfter(moment().subtract(2,'d'));
};

module.exports = {stillAlive};
