const requestor = require('@edgeguideab/client-request');

const search = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let searchString = state.search.get('searchString');
    let response;
    let privateKey = state.user.get('privateKey');
    let organization = state.user.get('organization');
    let email = state.user.get('email');
    try {
      response = await requestor.get('http://localhost:8000/documents', {
        query: {
          searchString,
          organization,
          email
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
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
