const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');
const embedPrivateKey = require('actions/utilities/embedPrivateKey');

const setUpdateDocument = id => {
  return async (dispatch, getState) => {
    let state = getState();
    let searchResult = state.search.get('result').toJS();
    let doc = searchResult.find((item) => {
      return item._id === id;
    });
    let docFields = {};
    Object.entries(doc._source).forEach(([key, value]) => {
      let label = key == 'title' ? 'Title' : 'Text';
      docFields[key] = {
        value,
        label,
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

const paginationSearch = (index = 1) => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'PAGINATION_SEARCH_START'
    });

    let state = getState();
    let searchString = state.search.get('searchString');
    let privateKey = state.user.get('privateKey');
    let organization = state.user.get('organization');
    let email = state.user.get('email');
    let response;
    try {
      response = await requestor.get(`${config.server}/document`, {
        query: {
          searchString,
          organization,
          email,
          index
        },
        headers: embedPrivateKey(privateKey)
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
          return dispatch({
            type: 'PAGINATION_SEARCH_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'PAGINATION_SEARCH_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }
    return dispatch({
      type: 'PAGINATION_SEARCH_FOUND',
      payload: {
        searchResult: response.body.searchResult,
        totalHits: response.body.totalHits,
        searchedString: searchString
      }
    });
  };
};

module.exports = { setUpdateDocument, paginationSearch};
