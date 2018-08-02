module.exports = client => {
  const getAttachment = ({ organizationIndex, documentId }) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.get({
          index: organizationIndex,
          type: 'fortdox_document',
          id: documentId,
          _sourceExclude: ['texts', 'title', 'encrypted_texts']
        });
        return resolve(response._source.attachments);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  };

  return getAttachment;
};
