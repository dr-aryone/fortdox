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
  tags: {
    value: '',
    list: [],
    oldTags: []
  },
  error: null,
  isLoading: false,
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE_CREATE_DOC':
      return state
        .setIn(['docFields', action.inputName, 'value'], fromJS(action.inputValue))
        .setIn(['docFields', action.inputName, 'error'], null);
    case 'INPUT_CHANGE_TAGS_CREATE_DOC':
      return state.setIn(['tags', 'value'], fromJS(action.inputValue));
    case 'CREATE_DOC_ADD_TAG_SUCCESS':
      return state.setIn(['tags', 'value'], '').setIn(['tags', 'list'], fromJS(action.payload));
    case 'CREATE_DOC_REMOVE_TAG_SUCCESS':
      return state.setIn(['tags', 'list'], fromJS(action.payload));
    case 'GET_OLD_TAGS_SUCCESS':
      return state.setIn(['tags', 'oldTags'], fromJS(action.payload));
    case 'GET_OLD_TAGS_ERROR':
      return state.set('error', fromJS(action.payload));
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
