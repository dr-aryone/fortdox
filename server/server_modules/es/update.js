const {encryptDocument} = require('../crypt/authentication/cryptDocument');

module.exports = client => {
  const update = (query, privateKey, encryptedMasterPassword) => {
    return new Promise(async (resolve, reject) => {
      let encryptedText;
      try {
        encryptedText = await encryptDocument(query.updateQuery.text, privateKey, encryptedMasterPassword);
      } catch (error) {
        console.err(error);
        return reject(500);
      }
      query.updateQuery.text = encryptedText.toString('base64');
      let response;
      try {
        response = await client.update({
          index: query.index,
          type: query.type,
          id: query.id,
          refresh: true,
          body: {
            doc: query.updateQuery
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
