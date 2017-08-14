module.exports = client => {
  const deleteIndex = organizationName => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.indices.delete({
          index: organizationName.toLowerCase()
        });
        return resolve(200);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return deleteIndex;
};
