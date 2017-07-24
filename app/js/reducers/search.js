const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
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
    case 'PAGINATION_SEARCH_FOUND':
      return state.merge({
        result: fromJS(action.payload.searchResult),
        error: null,
        isLoading: false,
        searchedString: fromJS(action.payload.searchedString),
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
