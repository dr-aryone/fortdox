const uuid = require('uuid');

module.exports = client => {
  const addToIndex = ({ query, organizationIndex }) => {
    return new Promise(async (resolve, reject) => {
      let response;
      let attachments = query.attachments || [];
      attachments = attachments.map(attachment => ({
        name: `${uuid()}-${attachment.name}`,
        file_type: attachment.file_type,
        file: attachment.file
      }));

      try {
        response = await client.index({
          index: organizationIndex,
          type: 'fortdox_document',
          body: {
            title: query.title,
            encrypted_texts: query.encryptedTexts,
            texts: query.texts,
            tags: query.tags,
            attachments: attachments
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
