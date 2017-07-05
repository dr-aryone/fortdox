const db = require('app/models');
const {decryptMasterPassword} = require('app/crypt/keys/cryptMasterPassword');

module.exports = function(username, privateKey) {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({where: {username: username}});
      if (!user) {
        return reject(404);
      }
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    let result = decryptMasterPassword(privateKey, encryptedMasterPassword);
    return resolve(result);

  });
};
