const embedPrivateKey = (privateKey) => {
  let config = require('../../../config.json');
  let name = config.name;
  return {
    'Authorization': `${name} ${privateKey}`
  };
};

module.exports = embedPrivateKey;
