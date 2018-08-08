const es = require('app/elastic_search');
const logger = require('app/logger');
const expect = require('@edgeguideab/expect');

async function updateDocument(orgIndex, documentId, email) {
  try {
    const current = await es.client.get({
      index: orgIndex,
      type: 'fortdox_document',
      id: documentId
    });
    let favorite = current._source.favorite || [];
    favorite.push(email);

    return es.client.update({
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

async function addFavorite(req, res) {
  const expectations = expect({ document: 'string' }, req.body);
  if (!expectations.wereMet()) {
    logger.error(expectations.errors());
    return res.status(500).send();
  }

  try {
    const orgIndex = req.session.organizationIndex;
    const document = req.body.document;
    const email = req.session.email;
    await updateDocument(orgIndex, document, email);
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  logger.log(
    '/favorite POSt',
    `${req.session.email} adds ${req.body.document} as favorite`
  );

  res.send();
}

module.exports = addFavorite;
