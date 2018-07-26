const logger = require('app/logger');
const es = require('app/elastic_search');

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

  let attachment;

  try {
    attachment = await es.getAttachment({
      documentId: id,
      attachmentIndex,
      organizationIndex
    });
  } catch (error) {
    logger.error('/document/id/attachment/attachmentIndex', error);
    return res.status(500).send();
  }

  res.send(attachment);
}

module.exports = getAttachment;
