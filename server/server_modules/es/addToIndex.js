const {encryptDocument} = require('../crypt/authentication/cryptDocument');

module.exports = client => {
  const addToIndex = (query, privateKey) => {
    return new Promise(async(resolve, reject) => {
      let response;
      let data = query.body.text;
      let encryptedData;
      try {
        encryptedData = await encryptDocument(data, privateKey);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
      query.body.text = encryptedData.toString('base64');
      try {
        response = await client.index({
          index: query.index,
          type: query.type,
          body: query.body,
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
