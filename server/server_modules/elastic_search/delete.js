module.exports = client => {
  const deleteDocument = ({ organizationIndex, type, id }) => {
    return new Promise(async (resolve, reject) => {
      let response;
      try {
        response = await client.delete({
          index: organizationIndex,
          type: type,
          id: id,
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
