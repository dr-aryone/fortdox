const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'http://localhost:9200'
});
const update = require('./update.js')(client);
const addToIndex = require('./addToIndex.js')(client);
const deleteDocument = require('./delete.js')(client);
const createIndex = require('./createIndex.js')(client);
const {paginationSearch} = require('./paginationSearch')(client);
const deleteIndex = require('./deleteIndex.js')(client);
const getTags = require('./getTags.js')(client);

module.exports = {
  client,
  update,
  addToIndex,
  deleteDocument,
  createIndex,
  paginationSearch,
  deleteIndex,
  getTags
};
