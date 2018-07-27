const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  host: 'http://localhost:9200'
});
const update = require('./update')(client);
const addToIndex = require('./addToIndex')(client);
const deleteDocument = require('./delete')(client);
const { createIndex } = require('./createIndex')(client);
const { paginationSearch, searchForDuplicates } = require('./search')(client);
const deleteIndex = require('./deleteIndex')(client);
const getTags = require('./getTags')(client);
const getDocument = require('./getDocument')(client);
const getAttachment = require('./getAttachment')(client);

module.exports = {
  client,
  update,
  addToIndex,
  deleteDocument,
  createIndex,
  paginationSearch,
  searchForDuplicates,
  deleteIndex,
  getTags,
  getDocument,
  getAttachment
};
