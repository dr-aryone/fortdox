module.exports = client => {
  const update = async (query) => {
    let response;
    console.log(query);
    try {
      response = await client.update({
        index: query.index,
        type: query.type,
        id: query.id,
        refresh: true,
        body: {
          doc: query.updateQuery
        }
      });
      return response;
    } catch (error) {
      console.error(error);
      return 501;
    }
  };
  return update;
};
