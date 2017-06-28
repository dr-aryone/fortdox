
module.exports = client => {
  const search = async (query) => {
    console.log(query);
    let response;
    try {
      response = await client.search({
        'index': 'document',
        'body': {
          'query': {
            query_string: {
              'query': `*${query.searchString}*~`
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
