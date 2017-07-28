module.exports = client => {
  const createIndex = organizationName => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.indices.create({
          index: organizationName.toLowerCase(),
          body: {
            mappings: {
              fortdox_document: {
                properties: {
                  title: {
                    type: 'text'
                  },
                  crypt_text: {
                    type: 'binary',
                    store: true
                  },
                  text: {
                    type: 'text'
                  },
                  tags: {
                    type: 'keyword'
                  }
                }
              }
            }
          }
        });
        return resolve(200);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return createIndex;
};
