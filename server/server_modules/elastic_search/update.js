const uuid = require('uuid');

module.exports = client => {
  const update = ({query, organization}) => {
    return new Promise(async (resolve, reject) => {
      let response;

      try {
        let current = await client.get({
          index: organization.toLowerCase(),
          type: 'fortdox_document',
          id: query.id
        });

        query.attachments = query.attachments.filter(attachment => {
          if (attachment.file) {
            attachment.name = `${uuid()}-${attachment.name}`;
            return attachment;
          }
          let storedAttachment = current._source.attachments.find(a => a.name === attachment.name) || {};
          attachment.file = storedAttachment.file;
          return attachment;
        });

        response = await client.update({
          index: organization.toLowerCase(),
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
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return update;
};
