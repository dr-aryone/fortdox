module.exports = client => {
  const getTags = organizationIndex => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.search({
          index: organizationIndex,
          body: {
            aggs: {
              distinct_tags: {
                terms: {
                  field: 'tags',
                  size: 10000
                }
              }
            }
          }
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(error);
      }
    });
  };

  return getTags;
};
