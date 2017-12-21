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


const addLogEntry = (documentId, user) => {
  debugger;
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
