const requestor = require('@edgeguideab/requestor');

const search = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let searchString = state.search.get('searchString');
    let response;
    try {
      response = await requestor.post('http://localhost:8000/user/search', {
        body: {searchString: searchString}
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'SEARCH_NOT_FOUND'
      });
    }
    return dispatch ({
      type: 'SEARCH_FOUND',
      title: response.body.title,
      text: response.body.text
    });
  };
};

module.exports = search;
