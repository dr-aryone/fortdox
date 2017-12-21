const db = require('app/models');

const get = (documentId) => {
  return new Promise(async (resolve, reject) => {
    let doc;
    try {
      doc = await db.Changelog.findAll({
        where: {
          elasticSearchId: documentId
        }
      });
    } catch (error) {
      console.log(error);
      return reject();
    }
    return doc;
  });
};

const getLatestEntries = () => {
  return new Promise(async (resolve, reject) => {
    let entries;
    try {
      entries = await db.Changelog.findAll({
        order: ['createdAt', 'ASC'],
        limit: 10,
        raw: true
      });
    } catch (error) {
      console.log(error);
      return reject(500);
    }
    return resolve(entries);
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
  getLatestEntries,
  addLogEntry,
  get,
  remove
};
