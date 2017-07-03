const {encryptDocument} = require('../crypt/authentication/cryptDocument');

module.exports = client => {
  const update = async (query) => {
    let encryptedText;
    try {
      encryptedText = await encryptDocument(query.updateQuery.text, query.privateKey);
    } catch (error) {
      console.err(error);
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
      return response;
    } catch (error) {
      console.error(error);
      return 501;
    }
  };
  return update;
};
