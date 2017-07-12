const db = require('app/models');
const {decryptMasterPassword} = require('app/crypt/keys/cryptMasterPassword');

const verifyUser = function(email, privateKey) {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({where: {email: email}});
      if (!user) {
        return reject(404);
      }
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    let result = decryptMasterPassword(privateKey, encryptedMasterPassword);

    try {
      await user.updateAttributes({uuid: null});
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);

  });
};

const verifyNewUser = function(uuid, privateKey, username) {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({
        where: {
          uuid
        }
      });
      if (!user) {
        return reject(404);
      }
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    let result = decryptMasterPassword(privateKey, encryptedMasterPassword);

    try {
      await user.updateAttributes({
        uuid: null,
        username
      });

    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve(result);

  });
};

module.exports = {verifyUser, verifyNewUser};
