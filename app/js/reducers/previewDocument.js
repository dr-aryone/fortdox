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
    case 'OPEN_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'OPEN_DOCUMENT_DONE':
      return state.merge({
        docFields: state.get('docFields').merge({
          title: fromJS(action.title),
          encryptedTexts: fromJS(action.encryptedTexts),
          texts: fromJS(action.texts),
          tags: state.getIn(['docFields', 'tags']).set('list', fromJS(action.tags)),
          attachments: fromJS(action.attachments),
          nextID: fromJS(action.nextID)
        }),
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
    default:
      return state;
  }
};

module.exports = preview;
