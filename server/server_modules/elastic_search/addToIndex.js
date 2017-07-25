const {encryptDocument} = require('../crypt/authentication/cryptDocument');

module.exports = client => {
  const addToIndex = (query, privateKey, encryptedMasterPassword, organization) => {
    return new Promise(async (resolve, reject) => {
      let response;
      let data = new Buffer(query.body.text);
      let encryptedData;
      try {
        encryptedData = await encryptDocument(data, privateKey, encryptedMasterPassword);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
      query.body.text = encryptedData.toString('base64');
      try {
        response = await client.index({
          index: organization.toLowerCase(),
          type: 'document',
          body: {
            title: query.body.title,
            text: query.body.text,
            tags: query.body.tags
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
