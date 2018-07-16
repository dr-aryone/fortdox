module.exports = client => {
  const deleteIndex = organizationIndex => {
    return new Promise(async (resolve, reject) => {
      try {
        await client.indices.delete({
          index: organizationIndex
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
