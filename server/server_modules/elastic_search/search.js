module.exports = client => {
  const paginationSearch = (query, limit = 10) => {
    return new Promise(async (resolve, reject) => {
      let from = (query.index > 0) ? query.index * limit - limit : 0;
      let response;
      try {
        response = await client.search({
          index: query.organization.toLowerCase(),
          body: {
            query: {
              bool: {
                should: [{
                  query_string: {
                    query: `*${query.searchString}*~`
                  }
                }, {
                  regexp: {
                    _all: '.*' + query.searchString + '.*'
                  }
                }, {
                  fuzzy: {
                    _all: query.searchString
                  }
                }]
              }
            },
            highlight: {
              pre_tags: ['%%#%%'],
              post_tags: ['%%#%%'],
              fields: {
                '*': {
                  fragment_size: 250,
                  number_of_fragments: 1
                }
              },
              require_field_match: false
            },
            from: from,
            size: limit
          },
          _sourceExclude: ['attachments', 'encrypted_texts'],
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  };

  const paginationSearchAll = (query) => {
    query.index = '_all';
    return paginationSearch(query);
  };

  const searchForDuplicates = ({organization, searchString}) => {
    return new Promise(async (resolve, reject) => {
      if (searchString.length < 3) {
        return resolve([]);
      }

      let response;
      try {
        response = await client.search({
          index: organization.toLowerCase(),
          body: {
            query: {
              bool: {
                should: [{
                  regexp: {
                    _all: `.*${searchString}.*`
                  }
                }, {
                  fuzzy: {
                    _all: searchString
                  }
                }]
              }
            }
          },
          _source: 'title'
        });
        let hits = response.hits.hits.map(hit => ({
          _id: hit._id,
          title: hit._source.title
        }));
        return resolve(hits);
      } catch (error) {
        return reject(error);
      }
    });
  };

  return {
    paginationSearch,
    paginationSearchAll,
    searchForDuplicates
  };
};
