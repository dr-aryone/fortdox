const requestor = require('@edgeguideab/client-request');

const search = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let searchString = state.search.get('searchString');
    let response;
    try {
      response = await requestor.get('http://localhost:8000/documents', {
        query: {
          index: 'document',
          title: searchString
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch ({
        type: 'SEARCH_NOT_FOUND'
      });
    }
    return dispatch ({
      type: 'SEARCH_FOUND',
      payload: response.body
    });
  };
};

const setUpdateDocument = id => {
  return async (dispatch, getState) => {
    let state = getState();
    let searchResult = state.search.get('result').toJS();
    let doc = searchResult.find((item) => {
      return item._id === id;
    });
    dispatch({
      type: 'UPDATE_DOCUMENT',
      payload: doc
    });
  };
};


module.exports = {search, setUpdateDocument};
