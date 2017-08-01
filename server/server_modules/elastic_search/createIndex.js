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
                  encrypted_text: {
                    properties: {
                      text: {
                        type: 'binary',
                        store: true
                      },
                      id: {
                        type: 'binary',
                        store: true
                      }
                    }
                  },
                  text: {
                    properties: {
                      text: {
                        type: 'text',
                        store: true
                      },
                      id: {
                        type: 'binary',
                        store: true
                      }
                    }
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
