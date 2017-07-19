module.exports = client => {
  const createIndex = organizationName => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.indices.create({
          index: organizationName.toLowerCase()
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
