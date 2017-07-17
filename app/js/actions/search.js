const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');

const search = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'SEARCH_START'
    });
    let state = getState();
    let searchString = state.search.get('searchString');
    let response;
    let privateKey = state.user.get('privateKey');
    let organization = state.user.get('organization');
    let email = state.user.get('email');
    try {
      response = await requestor.get(`${config.server}/documents`, {
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
    let docFields = {};
    Object.entries(doc._source).forEach(([key, value]) => {
      docFields[key] = {
        value,
        error: null
      };
    });
    dispatch({
      type: 'SET_UPDATE_DOCUMENT',
      payload: {
        documentToUpdate: doc,
        docFields
      }
    });
  };
};


module.exports = {search, setUpdateDocument};
