const {fromJS} = require('immutable');

let initialState = fromJS({
  docFields: {
    title: {
      value: '',
      label: 'Title',
      error: null
    },
    text: {
      value: '',
      label: 'Text',
      error: null
    }
  },
  isLoading: false,
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_CREATE_DOC':
      return state.setIn(['docFields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['docFields', action.inputName, 'error'], null);
    case 'CREATE_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'CREATE_DOCUMENT_ERROR':
      return state.merge({
        docFields: state.get('docFields').mergeDeepWith((oldError, newError) => newError ? newError : oldError, action.payload),
        isLoading: false,
      });
    case 'CREATE_DOCUMENT_SUCCESS':
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
