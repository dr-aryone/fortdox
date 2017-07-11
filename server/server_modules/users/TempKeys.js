const db = require('app/models');

module.exports = (uuid, encryptedPrivateKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.TempKeys.create({
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
