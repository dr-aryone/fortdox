const {fromJS} = require('immutable');

let initialState = fromJS({
  documentToUpdate: null,
  docFields: {},
  isLoading: false
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_UPDATE_DOC':
      return state.setIn(['docFields', action.inputName, 'value'], fromJS(action.inputValue));
    case 'SET_UPDATE_DOCUMENT':
      return state.merge({
        documentToUpdate: fromJS(action.payload.documentToUpdate),
        docFields: fromJS(action.payload.docFields)
      });
    case 'UPDATE_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'UPDATE_DOCUMENT_ERROR':
      return state.merge({
        docFields: state.get('docFields').mergeDeepWith((oldError, newError) => newError ? newError : oldError, action.payload),
        isLoading: false
      });
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'UPDATE_DOC_VIEW_TO_DEFAULT':
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
