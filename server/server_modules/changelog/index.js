const db = require('app/models');

const get = (documentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Changelog.findAll({
        where: {
          elasticSearchId: documentId
        },
        order: [['createdAt', 'ASC']],
        raw: true
      }).then(logentries => {
        logentries = logentries.map(entry => {
          entry.createdAt = entry.createdAt.getDate() + '-' +
            (entry.createdAt.getMonth() < 9 ? '0' : '') +
            (entry.createdAt.getMonth() + 1) + '-' +
            entry.createdAt.getFullYear() + ' ' +
            entry.createdAt.getHours() + ':' + entry.createdAt.getMinutes();
          return entry;
        });
        return resolve(logentries);
      });
    } catch (error) {
      console.log(error);
      return reject(500);
    }
  });
};


const addLogEntry = (documentId, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Changelog.create({
        elasticSearchId: documentId,
        user
      });
      return resolve(200);
    } catch (error) {
      console.log(error);
      return reject(500);
    }
  });
};

const remove = (documentId) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.Changelog.destroy({
        where: {
          elasticSearchId: documentId
        }
      });
      return resolve(200);
    } catch (error) {
      console.log(error);
      return reject(500);
    }
  });
};


module.exports = {
  addLogEntry,
  get,
  remove
};
