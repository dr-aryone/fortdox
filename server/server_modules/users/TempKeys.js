const db = require('app/models');

const store = (uuid, encryptedPrivateKey) => {
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

const remove = (uuid) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.TempKeys.destroy({
        where: {
          uuid
        }
      });
      return resolve(200);
    } catch (error) {
      console.error(error);
      return reject(500);
    }

  });
};

module.exports = {store, remove};
