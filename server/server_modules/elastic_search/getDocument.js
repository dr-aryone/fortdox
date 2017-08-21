module.exports = client => {
  const getDocument = ({organization, documentId}) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.get({
          index: organization.toLowerCase(),
          type: 'fortdox_document',
          id: documentId
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  };

  return getDocument;
};
