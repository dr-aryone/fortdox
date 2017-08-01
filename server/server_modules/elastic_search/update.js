const {encryptDocument} = require('../encryption/authentication/documentEncryption');

module.exports = client => {
  const update = (query, privateKey, encryptedMasterPassword) => {
    return new Promise(async (resolve, reject) => {
      let encryptedTexts;
      try {
        encryptedTexts = await encryptDocument(query.doc.encryptedTexts, privateKey, encryptedMasterPassword);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
      let response;
      try {
        response = await client.update({
          index: query.index,
          type: query.type,
          id: query.id,
          refresh: true,
          body: {
            doc: {
              title: query.doc.title,
              encryptedTexts,
              texts: query.doc.texts,
              tags: query.doc.tags
            }
          }
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return update;
};
