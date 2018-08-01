const uuid = require('uuid');
const logger = require('app/logger');

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
        //logger.info('ES UPDATE', current);
        //logger.info('ES UPDATE', query);

        //break out only new types of attachments from the query..
        const newTypeofAttachments = current._source.attachments.filter(
          qa => qa.id !== undefined
        );

        //TODO:break this out and add test
        const toRemove = newTypeofAttachments.filter(a => {
          const found = query.attachments.find(qa => qa.id === a.id);
          if (!found) {
            return a;
          }
        });
        //logger.info('ES UPDATE', 'TO REMOVE', toRemove);
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
