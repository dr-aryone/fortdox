const {fromJS} = require('immutable');

let initialState = fromJS({
  documentToUpdate: null,
  titleValue: '',
  textValue: '',
  isLoading: false
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_UPDATE_DOC':
      return state.set(action.inputName, fromJS(action.inputValue));
    case 'UPDATE_DOCUMENT':
      return state.merge({
        'documentToUpdate': fromJS(action.payload),
        'titleValue': fromJS(action.payload._source.title),
        'textValue': fromJS(action.payload._source.text)
      });
    case 'UPDATE_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'UPDATE_DOCUMENT_ERROR':
      return state.set('isLoading', false);
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'UPDATE_DOC_VIEW_TO_DEFAULT':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
