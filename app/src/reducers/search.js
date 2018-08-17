const { fromJS } = require('immutable');

const initialState = fromJS({
  searchString: '',
  currentIndex: 0,
  rangeFrom: 0,
  result: [],
  error: null,
  message: null,
  searchedString: null,
  totalHits: null,
  isLoading: false,
  favoriteDocuments: []
});

const search = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_VIEW':
      return state.set('error', null).set('message', null);
    case 'SEARCH_START':
      return state
        .set('isLoading', true)
        .set('searchString', action.payload.searchString);
    case 'OPEN_DOCUMENT_START':
    case 'TAG_SEARCH_START':
    case 'GET_FAVORITE_DOCUMENTS_START':
      return state.set('isLoading', true);
    case 'OPEN_DOCUMENT_DONE':
      return state.set('isLoading', false);
    case 'OPEN_DOCUMENT_ERROR':
    case 'GET_FAVORITE_DOCUMENTS_ERROR':
      return state
        .set('isLoading', false)
        .set('error', fromJS(action.payload))
        .set('message', null);
    case 'SEARCH_SUCCESS':
    case 'TAG_SEARCH_SUCCESS':
      return state.merge({
        searchString: fromJS(action.payload.searchString),
        currentIndex: fromJS(action.payload.index),
        result: fromJS(action.payload.searchResult),
        error: null,
        message: null,
        isLoading: false,
        searchedString: fromJS(action.payload.searchString),
        totalHits: fromJS(action.payload.totalHits)
      });
    case 'SEARCH_ERROR':
    case 'TAG_SEARCH_ERROR':
      return state.merge({
        result: [],
        error: fromJS(action.payload),
        message: null,
        isLoading: false,
        totalHits: null
      });
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'CREATE_DOCUMENT_SUCCESS':
      return initialState.set('message', fromJS(action.payload.message));
    case 'DELETE_DOCUMENT_SUCCESS':
      return initialState.set('message', fromJS(action.payload));
    case 'DELETE_DOCUMENT_ERROR':
      return state.set('error', fromJS(action.payload));
    case 'SESSION_EXPIRED':
    case 'LOGOUT':
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    case 'PREVIEW_DOC_PREVIEW_ATTACHMENT_FAIL':
      return state.set('message', null);
    case 'GET_FAVORITE_DOCUMENTS_SUCCESS':
      return state
        .set('message', null)
        .set('error', null)
        .set('isLoading', false)
        .set('favoriteDocuments', fromJS(action.payload));
    default:
      return state;
  }
};

module.exports = search;
