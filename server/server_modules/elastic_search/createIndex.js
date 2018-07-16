module.exports = client => {
  const createIndex = organizationIndex => {
    return new Promise(async (resolve, reject) => {
      try {
        await attachmentPlugin();
        await client.indices.create({
          index: organizationIndex,
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
                        store: true,
                        index: false
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

  const attachmentPlugin = () => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.ingest.putPipeline({
          id: 'fortdox_attachment',
          body: {
            description: '_description',
            processors: [
              {
                foreach: {
                  field: 'attachments',
                  processor: {
                    attachment: {
                      field: '_ingest._value.file',
                      target_field: '_ingest._value.file'
                    }
                  }
                }
              }
            ]
          }
        });
      } catch (error) {
        console.error(error);
        return reject(error);
      }
      return resolve();
    });
  };
  return { createIndex };
};
