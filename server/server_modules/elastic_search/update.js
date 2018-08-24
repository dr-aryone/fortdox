const uuid = require('uuid');
const logger = require('app/logger');

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

        current._source.versions = current._source.versions || [];
        const versions = current._source.versions;
        const currentAttachments = current._source.attachments || [];

        //First check all attachments that are equal and give them
        const unchangedAttachments = [];
        query.attachments.forEach(qa => {
          const found = currentAttachments.find(ca => ca.id === qa.id);
          if (found) {
            unchangedAttachments.push(found);
          }
        });

        logger.verbose('UnchangedAttachments', unchangedAttachments);

        //check fi there is any old type of attachments
        let oldType = query.attachments.filter(oldAttachment => {
          if (!oldAttachment.id) {
            return oldAttachment;
          }
        });

        //check if we have any attachments that is not in the current one...
        //i.e this should only happen if someone restored an older version.
        const attachmentDiff = query.attachments.filter(a => {
          const found = currentAttachments.find(ca => ca.id === a.id);
          if (!found) {
            return a;
          }
        });
        logger.verbose('Attachment diff', attachmentDiff);

        //collect all attachments in all versions..
        let allAttachments = [];
        versions.forEach(v => {
          allAttachments = allAttachments.concat(v.attachments || []);
        });
        //Unique
        allAttachments = allAttachments.filter(
          (e, i) => allAttachments.findIndex(a => a['id'] === e['id']) === i
        );

        let restoredAttachments = allAttachments.filter(aa => {
          if (attachmentDiff.find(ad => ad.id === aa.id)) {
            return aa;
          }
        });
        logger.verbose('Restored attachments', restoredAttachments);

        oldType = oldType.filter(attachment => {
          if (attachment.file) {
            attachment.name = `${uuid()}-${attachment.name}`;
            return attachment;
          }
          let storedAttachment =
            current._source.attachments.find(a => a.name === attachment.name) ||
            {};
          attachment.file = storedAttachment.file;
          return attachment;
        });
        logger.verbose('Old type of attachments', oldType);

        const updatedAttachments = unchangedAttachments
          .concat(restoredAttachments)
          .concat(query.files)
          .concat(oldType);

        logger.verbose('All attachments', updatedAttachments);

        let doc = {
          title: query.title,
          encrypted_texts: query.encryptedTexts,
          texts: query.texts,
          tags: query.tags,
          attachments: updatedAttachments
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
        logger.error(error);
        return reject(500);
      }
    });
  };
  return update;
};
