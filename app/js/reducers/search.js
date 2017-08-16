const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
  currentIndex: 0,
  rangeFrom: 0,
  result: [],
  error: null,
  message: null,
  searchedString: null,
  totalHits: null,
  isLoading: false
});

const search = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_SEARCH':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEARCH_START':
    case 'PAGINATION_SEARCH_START':
    case 'TAG_SEARCH_START':
      return state.set('isLoading', true);
    case 'SEARCH_SUCCESS':
    case 'PAGINATION_SEARCH_SUCCESS':
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
    case 'PAGINATION_SEARCH_ERROR':
    case 'TAG_SEARCH_ERROR':
      return state.merge({
        result: [],
        error: fromJS(action.payload),
        message: null,
        isLoading: false,
        totalHits: null
      });
    case 'CHANGE_VIEW':
      if (action.payload === 'UPDATE_DOC_VIEW' ||
      action.payload === 'SEARCH_VIEW') {
        return state.set({
          message: null,
          error: null
        });
      } else {
        return initialState;
      }
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'CREATE_DOCUMENT_SUCCESS':
      return initialState.set('message', fromJS(action.payload));
    case 'SESSION_EXPIRED':
    case 'LOGOUT':
      return initialState;
    case 'VERIFY_LOGIN_CREDS_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = search;
