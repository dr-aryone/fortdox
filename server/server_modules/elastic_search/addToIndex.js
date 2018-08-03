module.exports = client => {
  const addToIndex = ({ query, organizationIndex, user }) => {
    return new Promise(async (resolve, reject) => {
      let response;
      let attachments = query.attachments || [];
      let doc = {
        title: query.title,
        encrypted_texts: query.encryptedTexts,
        texts: query.texts,
        tags: query.tags,
        attachments: attachments
      };
      let initialVersion = Object.assign(
        {
          user: user,
          createdAt: new Date()
        },
        doc
      );
      doc.versions = [initialVersion];
      try {
        response = await client.index({
          index: organizationIndex,
          type: 'fortdox_document',
          body: doc,
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
