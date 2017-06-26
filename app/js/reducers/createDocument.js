const {fromJS} = require('immutable');

let initialState = fromJS({
  titleValue: '',
  textValue: ''
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_CREATE_DOC':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEND_FORM_SUCCESS':
    case 'CREATE_DOC_VIEW_TO_DEFAULT':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
