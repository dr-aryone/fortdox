const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
  result: [],
  error: false,
  errorMsg: '',
  isLoading: false
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_SEARCH':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEARCH_START':
      return state.set('isLoading', true);
    case 'SEARCH_FOUND':
      return state.merge({
        'searchString': '',
        'result': fromJS(action.payload),
        'error': false,
        'errorMsg': '',
        'isLoading': false
      });
    case 'SEARCH_NOT_FOUND':
      return state.merge({
        'result': [],
        'documentToUpdate': null,
        'error': true,
        'errorMsg': action.payload,
        'isLoading': false
      });
    case 'SEARCH_VIEW_TO_DEFAULT':
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'DELETE_DOCUMENT_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = register;
