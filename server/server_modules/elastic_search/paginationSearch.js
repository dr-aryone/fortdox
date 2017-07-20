module.exports = client => {
  const paginationSearch = async (query) => {
    let from = query.index * 10 - 10;
    let response;
    try {
      response = await client.search({
        'index': query.organization.toLowerCase(),
        'body': {
          'query': {
            'bool': {
              'should': [{
                'query_string': {
                  'query': `*${query.searchString}*~`
                }
              }, {
                'regexp': {
                  '_all': '.*' + query.searchString + '.*'
                }
              }, {
                'fuzzy': {
                  '_all': query.searchString
                }
              }]
            },
            'from': from
          }
        }
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const paginationSearchAll = (query) => {
    query.index = '_all';
    return paginationSearch(query);
  };

  return {
    paginationSearch,
    paginationSearchAll
  };
};
