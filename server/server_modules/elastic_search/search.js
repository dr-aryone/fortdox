module.exports = client => {
  const paginationSearch = (query, limit = 10) => {
    return new Promise(async (resolve, reject) => {
      let from = query.index > 0 ? query.index * limit - limit : 0;
      let response;

      const searchQuery =
        query.searchString === ''
          ? { match_all: {} }
          : {
            bool: {
              should: [
                //should is treaded as an OR operator, i.e results from both queries will be used.
                {
                  multi_match: {
                    query: `${query.searchString.toLowerCase()}`,
                    fields: ['title', 'tags', 'texts.text'],
                    fuzziness: 2
                  }
                },
                {
                  query_string: {
                    query: `${query.searchString.toLowerCase()}*`
                  }
                }
              ]
            }
          };

      try {
        response = await client.search({
          index: query.organizationIndex,
          body: {
            query: searchQuery,
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
            }
          },
          from: from,
          size: limit,
          _sourceExclude: ['attachments', 'encrypted_texts']
        });

        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  };

  const searchForDuplicates = ({ organization, searchString }) => {
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
                should: [
                  {
                    regexp: {
                      _all: `.*${searchString}.*`
                    }
                  },
                  {
                    fuzzy: {
                      _all: searchString
                    }
                  }
                ]
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
    searchForDuplicates
  };
};
