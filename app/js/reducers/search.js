const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
  currentIndex: 0,
  rangeFrom: 0,
  result: [],
  error: null,
  searchedString: null,
  totalHits: null,
  isLoading: false
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_SEARCH':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'PAGINATION_SEARCH_START':
      return state.set('isLoading', true);
    case 'PAGINATION_SEARCH_SUCCESS':
      return state.merge({
        searchString: fromJS(action.payload.searchString),
        currentIndex: fromJS(action.payload.index),
        result: fromJS(action.payload.searchResult),
        error: null,
        isLoading: false,
        searchedString: fromJS(action.payload.searchString),
        totalHits: fromJS(action.payload.totalHits)
      });
    case 'PAGINATION_SEARCH_ERROR':
      return state.merge({
        result: [],
        error: fromJS(action.payload),
        isLoading: false,
        totalHits: null
      });
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_SUCCESS':
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
};

module.exports = register;
