const { fromJS } = require('immutable');

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
    preview: {
      name: null,
      data: null,
      type: null
    },
    changelog: null,
    nextID: 0
  },
  error: null,
  isLoading: false,
  showPreview: false,
  searchField: {
    show: false,
    value: ''
  },
  refreshFavorites: false
});

const preview = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_DOCUMENT_SUCCESS':
    case 'UPDATE_DOCUMENT_SUCCESS':
      return state
        .merge({
          docFields: action.payload.docFields,
          error: null,
          showPreview: true
        })
        .setIn(['docFields', 'encryptedTexts'], action.payload.encryptedTexts)
        .setIn(['docFields', 'texts'], action.payload.texts);
    case 'PREVIEW_DOC_GET_FAVORITE_DOCUMENTS_START':
      return state.set('isLoading', true).set('refreshFavorites', false);
    case 'PREVIEW_DOC_ADD_FAVORITE_START':
    case 'PREVIEW_DOC_DELETE_FAVORITE_START':
    case 'PREVIEW_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'PREVIEW_DOCUMENT_SUCCESS':
      return state
        .merge({
          docFields: fromJS(action.payload.docFields),
          isLoading: false,
          showPreview: true,
          error: null,
          searchField: {
            show: false
          }
        })
        .setIn(['docFields', 'encryptedTexts'], action.payload.encryptedTexts)
        .setIn(['docFields', 'texts'], action.payload.texts);
    case 'SHOW_SEARCH_FIELD':
      return state.setIn(['searchField', 'show'], true);
    case 'SEARCH_FIELD_CHANGE':
      return state.setIn(
        ['searchField', 'value'],
        fromJS(action.payload.value)
      );
    case 'OPEN_DOCUMENT_ERROR':
    case 'PREVIEW_DOC_ADD_FAVORITE_ERROR':
    case 'PREVIEW_DOC_DELETE_FAVORITE_ERROR':
    case 'PREVIEW_DOC_GET_FAVORITE_DOCUMENTS_ERROR':
      return state.set('isLoading', false).set('error', fromJS(action.payload));
    case 'SEARCH_SUCCESS':
    case 'CHANGE_VIEW':
      if (
        action.payload === 'UPDATE_DOC_VIEW' ||
        action.payload === 'PREVIEW_DOC' ||
        action.payload === 'SEARCH_VIEW'
      )
        return state;
      else return initialState;
    case 'DELETE_DOCUMENT_SUCCESS':
      return initialState;
    case 'PREVIEW_DOC_PREVIEW_ATTACHMENT_START':
      return state.set('isLoading', true);
    case 'PREVIEW_DOC_PREVIEW_ATTACHMENT_FAIL':
      return state.merge({
        isLoading: false,
        error: fromJS(action.payload)
      });
    case 'PREVIEW_DOC_PREVIEW_ATTACHMENT_SUCCESS':
      return state
        .merge({
          isLoading: false,
          error: null
        })
        .setIn(['docFields', 'preview'], fromJS(action.payload));
    case 'TAG_SEARCH_SUCCESS':
      return initialState;
    case 'PREVIEW_DOC_ADD_FAVORITE_SUCCESS':
    case 'PREVIEW_DOC_DELETE_FAVORITE_SUCCESS':
      return state.set('refreshFavorites', true).set('isLoading', false);
    case 'GET_FAVORITE_DOCUMENTS_SUCCESS':
      return state.set('isLoading', false);
    default:
      return state;
  }
};

module.exports = preview;
