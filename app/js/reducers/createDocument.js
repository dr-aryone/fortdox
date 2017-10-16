const {fromJS, List} = require('immutable');

let initialState = fromJS({
  docFields: {
    title: {
      value: '',
      id: 'title',
      label: 'Title',
      error: null
    },
    encryptedTexts: [{
      value: '',
      label: 'Encrypted Text',
      error: null,
      id: 0
    }],
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
    nextID: 1
  },
  error: null,
  isLoading: false,
  similarDocuments: []
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_DOC_INPUT_CHANGE_TITLE':
      return state
        .setIn(['docFields', 'title', 'value'], fromJS(action.payload))
        .setIn(['docFields', 'title', 'error'], null);
    case 'CREATE_DOC_INPUT_CHANGE_ENCRYPTED_TEXT':
      return state.setIn(['docFields', 'encryptedTexts'],
        state.getIn(['docFields', 'encryptedTexts']).update(action.index, field => field.merge({
          value: fromJS(action.value),
          error: null
        })));
    case 'CREATE_DOC_INPUT_CHANGE_TEXT':
      return state.setIn(['docFields', 'texts'],
        state.getIn(['docFields', 'texts']).update(action.index, field => field.merge({
          value: fromJS(action.value),
          error: null
        })));
    case 'CREATE_DOC_INPUT_CHANGE_TAGS':
      return state.setIn(['docFields', 'tags'], state.getIn(['docFields', 'tags']).merge({
        value: fromJS(action.value),
        suggested: fromJS(action.suggestedTags),
        error: null
      }));
    case 'CREATE_DOC_ADD_TAG':
      return state.setIn(['docFields', 'tags'], state.getIn(['docFields', 'tags']).merge({
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
    case 'CREATE_DOC_REMOVE_TAG':
      return state.setIn(['docFields', 'tags', 'list'], fromJS(action.payload));
    case 'CREATE_DOC_GET_OLD_TAGS_START':
      return state.set('isLoading', true);
    case 'CREATE_DOC_GET_OLD_TAGS_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'CREATE_DOC_GET_OLD_TAGS_SUCCESS':
      return state
        .setIn(['docFields', 'tags', 'old'], fromJS(action.payload))
        .set('isLoading', false);
    case 'CREATE_DOCUMENT_SET_TAG_INDEX':
      return state.setIn(['docFields', 'tags', 'activeTag'], fromJS(action.payload));
    case 'CREATE_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'CREATE_DOCUMENT_FAIL': {
      let encryptedTexts = state.getIn(['docFields', 'encryptedTexts']);
      encryptedTexts.forEach((entry, index) => {
        if (action.emptyFieldIDs.includes(entry.get('id'))) {
          encryptedTexts = encryptedTexts.update(index, field => field.set('error', fromJS(action.emptyFieldError)));
        }
      });
      let texts = state.getIn(['docFields', 'texts']);
      texts.forEach((entry, index) => {
        if (action.emptyFieldIDs.includes(entry.get('id'))) {
          encryptedTexts = encryptedTexts.update(index, field => field.set('error', fromJS(action.emptyFieldError)));
        }
      });
      return state.merge({
        docFields: state.get('docFields').merge({
          title: state.getIn(['docFields', 'title']).set('error', fromJS(action.titleError)),
          encryptedTexts,
          texts
        }),
        isLoading: false
      });
    }
    case 'CREATE_DOCUMENT_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'CREATE_DOC_NEW_ENCRYPTED_TEXT_FIELD':
      return state
        .setIn(['docFields', 'encryptedTexts'], fromJS(action.payload))
        .setIn(['docFields', 'nextID'], fromJS(action.nextID));
    case 'CREATE_DOC_NEW_TEXT_FIELD':
      return state
        .setIn(['docFields', 'texts'], fromJS(action.payload))
        .setIn(['docFields', 'nextID'], fromJS(action.nextID));
    case 'CREATE_DOC_REMOVE_FIELD':
      return state
        .setIn(['docFields', 'encryptedTexts'], fromJS(action.encryptedTexts))
        .setIn(['docFields', 'texts'], fromJS(action.texts));
    case 'CREATE_DOC_ADD_ATTACHMENT':
      return state
        .setIn(['docFields', 'attachments'], state.getIn(['docFields', 'attachments']).push(fromJS({
          name: fromJS(action.name),
          type: fromJS(action.fileType),
          file: fromJS(action.file)
        })));
    case 'CREATE_DOC_REMOVE_ATTACHMENT':
      return state.setIn(['docFields', 'attachments'], fromJS(action.payload));
    case 'CREATE_DOC_PREVIEW_ATTACHMENT_START':
      return state.set('isLoading', true);
    case 'CREATE_DOC_PREVIEW_ATTACHMENT_FAIL':
      return state.merge({
        error: fromJS(action.payload.error),
        isLoading: false
      });
    case 'CREATE_DOC_PREVIEW_ATTACHMENT_SUCCESS':
      return state.merge({
        isLoading: false,
        error: null
      }).setIn(['docFields', 'preview'], fromJS(action.payload));
    case 'DOCUMENT_TITLE_LOOKUP_DONE':
      return state.set('similarDocuments', action.payload.hits);
    case 'DOCUMENT_TITLE_LOOKUP_CLEAR':
      return state.set('similarDocuments', List());
    case 'CREATE_DOCUMENT_SUCCESS':
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
