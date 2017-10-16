const {fromJS} = require('immutable');

let initialState = fromJS({
  docFields: {
    title: {},
    encryptedTexts: [],
    texts: [],
    tags: {
      value: '',
      error: null,
      list: [],
      activeTag: -1,
      suggested: [],
      old: []
    },
    attachments: [],
    nextID: 0
  },
  error: null,
  isLoading: false,
  showPreview: false,
  searchField: {
    show: false,
    value: ''
  }
});

const preview = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'CREATE_DOCUMENT_SUCCESS':
      return state.merge({
        docFields: fromJS(action.docFields),
        error: null,
        showPreview: true
      });
    case 'PREVIEW_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'PREVIEW_DOCUMENT_DONE':
      return state.merge({
        docFields: fromJS(action.docFields),
        isLoading: false,
        showPreview: true,
        searchField: {
          show: false
        }
      });
    case 'SHOW_SEARCH_FIELD':
      return state.setIn(['searchField', 'show'], true);
    case 'SEARCH_FIELD_CHANGE':
      return state.setIn(['searchField', 'value'], fromJS(action.payload.value));
    case 'OPEN_DOCUMENT_FAILED':
      return state.set('isLoading', false);
    case 'SEARCH_SUCCESS':
    case 'CHANGE_VIEW':
      if (action.payload === 'UPDATE_DOC_VIEW' || action.payload === 'PREVIEW_DOC') return state;
      else return initialState;
    case 'DELETE_DOCUMENT_SUCCESS':
      return initialState;
    default:
      return state;
  }
};

module.exports = preview;
