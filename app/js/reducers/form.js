const {fromJS} = require('immutable');

let initialState = fromJS({
  formValue: '',
  titleValue: ''
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_FORM':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'SEND_FORM_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
