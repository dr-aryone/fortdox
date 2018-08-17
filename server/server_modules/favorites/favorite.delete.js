const es = require('app/elastic_search');
const logger = require('app/logger');

async function removeFavoriteDocument(orgIndex, documentId, email) {
  try {
    const current = await es.client.get({
      index: orgIndex,
      type: 'fortdox_document',
      id: documentId
    });
    let favorite = current._source.favorite || [];
    favorite.push(email);
    favorite = favorite.filter(f => f !== email);

    return await es.client.update({
      index: orgIndex,
      type: 'fortdox_document',
      id: documentId,
      body: {
        doc: {
          favorite: favorite
        }
      }
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
}

async function deleteFavorite(req, res) {
  try {
    const orgIndex = req.session.organizationIndex;
    const email = req.session.email;
    const document = req.params.id;
    await removeFavoriteDocument(orgIndex, document, email);
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  logger.log(
    '/favorite DELETE',
    `${req.session.email} remvoes ${req.body.document} as favorite`
  );

  res.send();
}

module.exports = deleteFavorite;
