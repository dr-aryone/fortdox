const db = require('app/models');
const userUtil = require('app/users/User');
const logger = require('app/logger');
const expect = require('@edgeguideab/expect');

async function addFavorite(req, res) {
  const expectations = expect({ document: 'string' }, req.body);
  if (!expectations.wereMet()) {
    logger.error(expectations.errors());
    return res.status(500).send();
  }

  logger.log(
    '/favorite POST',
    `${req.session.email} adds ${req.body.document} as favorite`
  );

  try {
    let user = await userUtil.getUser(req.session.email);
    await db.Favorites.create({
      elasticSearchId: req.body.document,
      userid: user.id
    });
  } catch (error) {
    logger.error(error);
    if (error.name === 'SequelizeUniqueConstraintError')
      return res.status(409).send();
    return res.status(500).send();
  }

  res.send();
}

module.exports = addFavorite;
