const es = require('app/elastic_search');
const logger = require('app/logger');

module.exports = {
  get
};

async function get(req, res) {
  let organization = req.query.organization;
  let response;
  try {
    response = await es.getTags(organization);
    return res.send(response.aggregations.distinct_tags.buckets);
  } catch (error) {
    logger.log('error', 'Could not get tags!');
    return res.status(500).send();
  }
}
