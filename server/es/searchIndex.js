module.exports = client => {
  const addIndex = async query => {
    let response;
    try {
      response = await client.index({
        index: query.index,
        type: query.type,
        body: query.body
      });
      return response;
    } catch (error) {
      console.error(error);
      return 500;
    }
  };

  return addIndex;
};
