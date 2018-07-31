const uuid = require('uuid');

module.exports = client => {
  const update = ({ query, organizationIndex }) => {
    return new Promise(async (resolve, reject) => {
      let response;

      try {
        let current = await client.get({
          index: organizationIndex,
          type: 'fortdox_document',
          id: query.id
        });
        console.log(current);
        console.log(query);
        //TODO:break this out and add test
        const toRemove = current._source.attachments.filter(a => {
          const found = query.attachments.find(qa => qa.id === a.id);
          if (!found) {
            return a;
          }
        });
        console.log('TO REMOVE', toRemove);

        query.attachments = query.attachments.filter(attachment => {
          if (attachment.file) {
            attachment.name = `${uuid()}-${attachment.name}`;
            return attachment;
          }
          let storedAttachment =
            current._source.attachments.find(a => a.name === attachment.name) ||
            {};
          attachment.file = storedAttachment.file;
          attachment.path = storedAttachment.path;

          return attachment;
        });

        query.attachments = query.attachments.concat(query.files);

        response = await client.update({
          index: organizationIndex,
          type: 'fortdox_document',
          id: query.id,
          refresh: true,
          body: {
            doc: {
              title: query.title,
              encrypted_texts: query.encryptedTexts,
              texts: query.texts,
              tags: query.tags,
              attachments: query.attachments
            }
          }
        });
        response.removed = toRemove;
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return update;
};
