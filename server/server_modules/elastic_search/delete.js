module.exports = client => {
  const deleteDocument = (query) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.delete({
          index: query.index,
          type: query.type,
          id: query.id,
          refresh: true
        });
        return resolve(response);
      } catch (error) {
        console.error(error);
        return reject(500);
      }
    });
  };
  return deleteDocument;
};
