module.exports = client => {
  const getDocument = ({ organizationIndex, documentId }) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.get({
          index: organizationIndex,
          type: 'fortdox_document',
          id: documentId,
          _sourceExclude: 'attachments.file'
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
