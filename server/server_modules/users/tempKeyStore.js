const db = require('app/models');

module.exports = (uuid, encryptedPrivateKey) => {
  return new Promise(async (resolve, reject) => {
    let user;
    try {
      user = await db.tempKeyStore.findOne({
        where: {
          uuid
        }
      });
      if (!user) {
        return reject(404);
      }
    } catch (error) {
      console.error(error);
      return reject(500);
    }

    try {
      await db.tempKeyStore.create({
        uuid,
        privateKey: encryptedPrivateKey
      });
      return resolve(201);
    } catch (error) {
      console.error(error);
      return reject(500);
    }

  });
};
