const logger = require('app/logger');
const es = require('app/elastic_search');
const fs = require('fs');

async function getAttachment(req, res) {
  let id = req.params.id;
  let attachmentIndex = req.params.attachmentIndex;
  let organizationIndex = req.session.organizationIndex;

  logger.info(
    '/document/id/attachment/attachmentIndex',
    'Get attachment for',
    id,
    ' attachment index',
    attachmentIndex
  );

  let isNewAttachment = attachmentIndex.charAt(0) === '@';

  let attachment;

  try {
    attachment = await es.getAttachment({
      documentId: id,
      organizationIndex
    });
  } catch (error) {
    logger.error('/document/id/attachment/attachmentIndex', error);
    return res.status(500).send();
  }

  if (isNewAttachment) {
    attachment.forEach(a => {
      if (a.id === attachmentIndex) {
        attachment = a;
        return;
      }
    });

    logger.verbose(
      '/document/id/attachment/attachmentIndex',
      'New type of file',
      attachment
    );
    //read file and send it down..
    fs.readFile(attachment.path, (err, data) => {
      if (err) {
        return res.status(500).send();
      }
      return res.send(Buffer.from(data).toString('base64'));
    });
  } else {
    attachment = attachment[attachmentIndex];
    logger.verbose(
      '/document/id/attachment/attachmentIndex',
      'Old type of file'
    );

    return res.send(attachment.file);
  }
}

module.exports = getAttachment;
