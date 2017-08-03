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
                  encrypted_texts: {
                    type: 'object',
                    properties: {
                      text: {
                        type: 'binary',
                        store: true
                      },
                      id: {
                        type: 'integer',
                        store: true,
                        index: false
                      }
                    }
                  },
                  texts: {
                    type: 'object',
                    properties: {
                      text: {
                        type: 'text'
                      },
                      id: {
                        type: 'integer',
                        store: true,
                        index: false
                      }
                    }
                  },
                  tags: {
                    type: 'keyword'
                  },
                  attachments: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'text',
                        store: true,
                        index: false
                      },
                      file: {
                        type: 'binary',
                        store: true
                      },
                      file_type: {
                        type: 'text',
                        store: true,
                        index: false
                      }
                    }
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
