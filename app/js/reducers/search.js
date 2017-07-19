const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
  result: [],
  error: null,
  isLoading: false,
  hasSearched: false
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_SEARCH':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEARCH_START':
      return state.set('isLoading', true);
    case 'SEARCH_FOUND':
      return state.merge({
        result: fromJS(action.payload),
        error: null,
        isLoading: false,
        hasSearched: true
      });
    case 'SEARCH_ERROR':
      return state.merge({
        result: [],
        error: fromJS(action.payload),
        isLoading: false,
        hasSearched: true
      });
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = register;
