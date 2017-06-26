const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

const {search, searchAll} = require('./search.js')(client);
const update = require('./update.js')(client);
const addIndex = require('./searchIndex.js')(client);

module.exports = {
  client,
  searchAll,
  search,
  update,
  addIndex
};
