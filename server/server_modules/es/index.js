const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'localhost:9200'
});
const {search, searchAll} = require('./search.js')(client);
const update = require('./update.js')(client);
const addToIndex = require('./addToIndex.js')(client);
const deleteDocument = require('./delete.js')(client);
const createIndex = require('./createIndex.js')(client);

module.exports = {
  client,
  searchAll,
  search,
  update,
  addToIndex,
  deleteDocument,
  createIndex
};
