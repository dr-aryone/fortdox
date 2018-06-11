const doc = require('./document');
const fields = require('./fields');
const tags = require('./tags');
const attachment = require('./attachments');

module.exports = {
  ...doc,
  ...fields,
  ...tags,
  ...attachment
};
