const {fromJS} = require('immutable');

let initialState = fromJS({
  documentToUpdate: null,
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
    nextID: 0
  },
  error: null,
  isLoading: false
});

const form = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DOC_INPUT_CHANGE_TITLE':
      return state
        .setIn(['docFields', 'title', 'value'], fromJS(action.payload))
        .setIn(['docFields', 'title', 'error'], null);
    case 'UPDATE_DOC_INPUT_CHANGE_ENCRYPTED_TEXT':
      return state.setIn(['docFields', 'encryptedTexts'],
        state.getIn(['docFields', 'encryptedTexts']).update(action.index, field => field.merge({
          value: fromJS(action.value),
          error: null
        })));
    case 'UPDATE_DOC_INPUT_CHANGE_TEXT':
      return state.setIn(['docFields', 'texts'],
        state.getIn(['docFields', 'texts']).update(action.index, field => field.merge({
          value: fromJS(action.value),
          error: null
        })));
    case 'UPDATE_DOC_INPUT_CHANGE_TAGS':
      return state.setIn(['docFields', 'tags'], state.getIn(['docFields', 'tags']).merge({
        value: fromJS(action.value),
        suggested: fromJS(action.suggestedTags),
        error: null
      }));
    case 'UPDATE_DOC_ADD_TAG_SUCCESS':
      return state.setIn(['docFields', 'tags'], state.getIn(['docFields', 'tags']).merge({
        value: '',
        list: fromJS(action.payload),
        suggested: [],
        error: null
      }));
    case 'UPDATE_DOC_ADD_TAG_FAIL':
      return state.setIn(['docFields', 'tags'], state.getIn(['docFields', 'tags']).merge({
        value: '',
        error: fromJS(action.payload),
        suggested: []
      }));
    case 'UPDATE_DOC_REMOVE_TAG_SUCCESS':
      return state.setIn(['docFields', 'tags', 'list'], fromJS(action.payload));
    case 'UPDATE_DOC_GET_OLD_TAGS_START':
      return state.set('isLoading', true);
    case 'UPDATE_DOC_GET_OLD_TAGS_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false
      });
    case 'UPDATE_DOC_GET_OLD_TAGS_SUCCESS':
      return state
        .setIn(['docFields', 'tags', 'old'], fromJS(action.payload))
        .set('isLoading', false);
    case 'SET_UPDATE_DOCUMENT':
      return state.merge({
        documentToUpdate: fromJS(action.documentToUpdate),
        docFields: state.get('docFields').merge({
          title: fromJS(action.title),
          encryptedTexts: fromJS(action.encryptedTexts),
          texts: fromJS(action.texts),
          tags: state.getIn(['docFields', 'tags']).set('list', fromJS(action.tags)),
          nextID: fromJS(action.nextID)
        })
      });
    case 'UPDATE_DOCUMENT_START':
      return state.set('isLoading', true);
    case 'UPDATE_DOCUMENT_FAIL': {
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
    case 'UPDATE_DOCUMENT_ERROR':
      return state.merge({
        error: fromJS(action.payload),
        isLoading: false,
      });
    case 'UPDATE_DOC_NEW_ENCRYPTED_TEXT_FIELD':
      return state
        .setIn(['docFields', 'encryptedTexts'], fromJS(action.payload))
        .setIn(['docFields', 'nextID'], fromJS(action.nextID));
    case 'UPDATE_DOC_NEW_TEXT_FIELD':
      return state
        .setIn(['docFields', 'texts'], fromJS(action.payload))
        .setIn(['docFields', 'nextID'], fromJS(action.nextID));
    case 'UPDATE_DOC_REMOVE_FIELD':
      return state
        .setIn(['docFields', 'encryptedTexts'], fromJS(action.encryptedTexts))
        .setIn(['docFields', 'texts'], fromJS(action.texts));
    case 'UPDATE_DOCUMENT_SUCCESS':
    case 'UPDATE_DOC_VIEW_TO_DEFAULT':
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = form;
