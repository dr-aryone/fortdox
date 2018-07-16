const es = require('app/elastic_search');
const logger = require('app/logger');

module.exports = {
  get
};

async function get(req, res) {
  let organizationIndex = req.session.organizationIndex;
  let response;
  try {
    response = await es.getTags(organizationIndex);
    return res.send(response.aggregations.distinct_tags.buckets);
  } catch (error) {
    logger.log('error', 'Could not get tags!');
    return res.status(500).send();
  }
}
