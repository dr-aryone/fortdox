const db = require('app/models');
const userUtil = require('app/users/User');
const logger = require('app/logger');

async function deleteFavorite(req, res) {
  logger.log(
    '/favorite DELETE',
    `${req.session.email} removes ${req.body.document} as favorite`
  );

  try {
    const user = await userUtil.getUser(req.session.email);
    await db.Favorites.destroy({
      where: {
        userid: user.id,
        elasticSearchId: req.params.id
      }
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).send();
  }

  res.send();
}

module.exports = deleteFavorite;
