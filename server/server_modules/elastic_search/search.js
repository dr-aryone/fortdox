module.exports = client => {
  const paginationSearch = query => {
    return new Promise(async (resolve, reject) => {
      let from = (query.index > 0) ? query.index * 10 - 10 : 0;
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
            from: from
          }
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
      let response;
      try {
        response = await client.search({
          index: organization.toLowerCase(),
          body: {
            query: {
              wildcard: {
                title: `${searchString}*`
              }
            },
          },
          _source: 'title'
        });
        return resolve(response);
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
