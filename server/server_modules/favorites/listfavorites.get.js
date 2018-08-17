const es = require('app/elastic_search');
const logger = require('app/logger');

async function findFavourites(orgIndex, email) {
  return await es.client.search({
    index: orgIndex,
    _sourceExclude: ['attachments', 'encrypted_texts'],
    body: {
      query: {
        match: {
          favorite: email
        }
      }
    }
  });
}

async function listFavorites(req, res) {
  try {
    const email = req.session.email;
    let fav = await findFavourites(req.session.organizationIndex, email);

    logger.info('/favorites', `${email} lists favorites`);

    fav = fav.hits.hits.map(h => {
      return { id: h._id, ...h._source };
    });
    fav = fav.filter(f => f.favorite.includes(email));

    return res.send(fav);
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }
}
module.exports = listFavorites;
