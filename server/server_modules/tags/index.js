const es = require('app/elastic_search');
const logger = require('app/logger');

module.exports = {
  get
};

async function get(req, res) {
  let organizationIndex = req.session.organizationIndex;
  let response;

  logger.info('/tags', 'Fetching tags for organization', organizationIndex);
  try {
    response = await es.getTags(organizationIndex);
    return res.send(response.aggregations.distinct_tags.buckets);
  } catch (error) {
    logger.error('/tags', 'Could not get tags!', error);
    return res.status(500).send();
  }
}
