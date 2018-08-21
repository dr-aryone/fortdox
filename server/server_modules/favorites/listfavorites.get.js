const db = require('app/models');
const userUtil = require('app/users/User');
const logger = require('app/logger');
const es = require('app/elastic_search');

async function listFavorites(req, res) {
  try {
    const email = req.session.email;
    const organizationIndex = req.session.organizationIndex;
    const user = await userUtil.getUser(email);
    let favorites = await db.Favorites.findAll({
      where: {
        userid: user.id
      }
    });

    logger.info('/favorites', `${email} lists favorites`);
    let result = [];
    try {
      result = await Promise.all(
        favorites.map(async favorite => {
          const doc = await es.getDocument({
            organizationIndex,
            documentId: favorite.elasticSearchId
          });
          return {
            id: favorite.elasticSearchId,
            title: doc._source.title
          };
        })
      );
    } catch (error) {
      logger.error(error);
      return res.status(500).send();
    }

    return res.send(result);
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }
}
module.exports = listFavorites;
