const {encryptDocument} = require('../encryption/authentication/documentEncryption');

module.exports = client => {
  const addToIndex = (query, tags, privateKey, encryptedMasterPassword, organization) => {
    return new Promise(async (resolve, reject) => {
      let response;
      let data = new Buffer(query.text);
      let encryptedData;
      try {
        encryptedData = await encryptDocument(data, privateKey, encryptedMasterPassword);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
      query.text = encryptedData.toString('base64');
      try {
        response = await client.index({
          index: organization.toLowerCase(),
          type: 'fortdox_document',
          body: {
            title: query.title,
            encrypted_text: query.text,
            tags: tags
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
