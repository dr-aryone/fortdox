const requestor = require('@edgeguideab/client-request');
const config = require('config.json');
const HITS_PER_PAGE = 12;

const search = ({ index = 1, freshSearch = false, searchString } = {}) => {
  return async (dispatch, getState) => {
    const state = getState();
    if (freshSearch) {
      searchString = searchString || '';
    } else {
      searchString = searchString || state.search.get('searchedString') || '';
    }
    dispatch({
      type: 'SEARCH_START',
      payload: {
        searchString,
        index
      }
    });
    let organization = state.user.get('organization');
    let email = state.user.get('email');
    document.getElementById('top').scrollIntoView();
    let response;
    try {
      response = await requestor.get(`${config.server}/document`, {
        query: {
          searchString,
          organization,
          email,
          index,
          results: HITS_PER_PAGE
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 401:
          return dispatch({
            type: 'SEARCH_ERROR',
            payload: 'Unauthorized'
          });
        case 400:
        case 404:
          return dispatch({
            type: 'SEARCH_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'SEARCH_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    return dispatch({
      type: 'SEARCH_SUCCESS',
      payload: {
        index: index,
        searchResult: response.body.searchResult,
        totalHits: response.body.totalHits,
        searchString: searchString
      }
    });
  };
};

const tagSearch = tag => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'TAG_SEARCH_START'
    });
    let state = getState();
    let organization = state.user.get('organization');
    let email = state.user.get('email');
    let index = 1;
    let response;
    try {
      response = await requestor.get(`${config.server}/document`, {
        query: {
          searchString: tag,
          organization,
          email,
          index
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
          return dispatch({
            type: 'TAG_SEARCH_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'TAG_SEARCH_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }
    return dispatch({
      type: 'TAG_SEARCH_SUCCESS',
      payload: {
        index: index,
        searchResult: response.body.searchResult,
        totalHits: response.body.totalHits,
        searchString: tag
      }
    });
  };
};

export default { search, tagSearch, HITS_PER_PAGE };
