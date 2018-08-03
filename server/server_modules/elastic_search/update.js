const uuid = require('uuid');

module.exports = client => {
  const update = ({ query, organizationIndex, user }) => {
    return new Promise(async (resolve, reject) => {
      let response;

      try {
        let current = await client.get({
          index: organizationIndex,
          type: 'fortdox_document',
          id: query.id
        });

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

        let doc = {
          title: query.title,
          encrypted_texts: query.encryptedTexts,
          texts: query.texts,
          tags: query.tags,
          attachments: query.attachments
        };

        let newVersion = Object.assign(
          { user: user, createdAt: new Date() },
          doc
        );
        doc.versions = current._source.versions.concat(newVersion);

        response = await client.update({
          index: organizationIndex,
          type: 'fortdox_document',
          id: query.id,
          refresh: true,
          body: {
            doc: doc
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
