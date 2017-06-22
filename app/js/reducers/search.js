const {fromJS} = require('immutable');

const initialState = fromJS({
  searchString: '',
  result: {
    title: '',
    text: ''
  },
  error: false,
  errorMsg: ''
});

const register = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_SEARCH':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEARCH_FOUND':
      return state.merge({
        'searchString': '',
        'result': {
          'title': action.title,
          'text': action.text
        },
        error: false,
        errorMsg: ''
      });
    case 'SEARCH_NOT_FOUND':
      return state.merge({
        'error': true,
        'errorMsg': ''
      });
    default:
      return state;
  }
};

module.exports = register;
