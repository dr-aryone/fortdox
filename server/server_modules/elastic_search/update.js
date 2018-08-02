const uuid = require('uuid');
const logger = require('app/logger');
const findRemovedAttachments = require('./updateUtil');

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
        const newTypeofAttachments = current._source.attachments.filter(
          qa => qa.id !== undefined
        );

        const toRemove = findRemovedAttachments(
          newTypeofAttachments,
          query.attachments
        );

        logger.info(
          'ES UPDATE',
          `Number of attachment files to remove ${toRemove.length}`
        );
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
