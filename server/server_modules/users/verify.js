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

const verifyNewUser = function(uuid, privateKey) {
  return new Promise(async (resolve, reject) => {
    let encryptedMasterPassword;
    let user;
    try {
      user = await db.User.findOne({
        where: {
          uuid
        },
        include: [db.Organization]
      });
      if (!user) {
        return reject(404);
      }
      encryptedMasterPassword = user.password;
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    decryptMasterPassword(privateKey, encryptedMasterPassword);
    try {
      await user.updateAttributes({
        uuid: null,

      });
    } catch (error) {
      console.error(error);
      return reject(500);
    }
    return resolve({
      email: user.email,
      organization: user.Organization.name
    });

  });
};

module.exports = {verifyUser, verifyNewUser};
