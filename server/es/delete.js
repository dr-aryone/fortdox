module.exports = client => {

  const deleteDocument = async (query) => {
    let response;
    try {
      response = await client.delete({
        index: query.index,
        type: query.type,
        id: query.id,
        refresh: true
      });
      return response;
    } catch (error) {
      console.error(error);
      return 500;
    }
  };
  return deleteDocument;
};
