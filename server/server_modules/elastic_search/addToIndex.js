const {encryptDocument} = require('../encryption/authentication/documentEncryption');

module.exports = client => {
  const addToIndex = (doc, privateKey, encryptedMasterPassword, organization) => {
    return new Promise(async (resolve, reject) => {
      let encryptedTexts;
      try {
        encryptedTexts = await encryptDocument(doc.encryptedTexts, privateKey, encryptedMasterPassword);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
      let response;
      try {
        response = await client.index({
          index: organization.toLowerCase(),
          type: 'fortdox_document',
          pipeline: 'fortdox_attachment',
          body: {
            title: doc.title,
            encrypted_texts: encryptedTexts,
            texts: doc.texts,
            tags: doc.tags,
            attachments: doc.attachments
          },
          refresh: true
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };

  return addToIndex;
};
