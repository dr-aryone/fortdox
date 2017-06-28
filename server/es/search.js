
module.exports = client => {
  const search = async (query) => {
    console.log(query);
    let response;
    try {
      response = await client.search({
        'index': 'document',
        'body': {
          'query': {
            'bool': {
              'should': [{
                'fuzzy': {
                  '_all': query.searchString,
                }
              },
              {
                'wildcard': {
                  '_all': `*${query.searchString}*`
                }
              }]
            }
          }
        }
      });
      return response;
    } catch (error) {
      console.error(error);

    }
  };

  const searchAll = (query) => {
    query.index = '_all';
    return search(query);
  };

  return {
    search,
    searchAll
  };
};
