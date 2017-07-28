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
    error: null,
    list: [],
    activeTag: -1,
    suggested: [],
    old: []
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
      return state.set('tags', state.get('tags').merge({
        value: fromJS(action.value),
        suggested: fromJS(action.suggestedTags),
        error: null
      }));
    case 'CREATE_DOC_ADD_TAG_SUCCESS':
      return state.set('tags', state.get('tags').merge({
        value: '',
        list: fromJS(action.payload),
        suggested: [],
        error: null
      }));
    case 'CREATE_DOC_ADD_TAG_FAIL':
      return state.set('tags', state.get('tags').merge({
        value: '',
        error: fromJS(action.payload),
        suggested: []
      }));
    case 'CREATE_DOC_REMOVE_TAG_SUCCESS':
      return state.setIn(['tags', 'list'], fromJS(action.payload));
    case 'GET_OLD_TAGS_START':
      return state.set('isLoading', true);
    case 'GET_OLD_TAGS_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'GET_OLD_TAGS_SUCCESS':
      return state
        .setIn(['tags', 'old'], fromJS(action.payload))
        .set('isLoading', false);
    case 'CREATE_DOCUMENT_SET_TAG_INDEX':
      return state.setIn(['tags', 'activeTag'], fromJS(action.payload));
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
