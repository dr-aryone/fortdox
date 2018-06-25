const { fromJS } = require('immutable');
const requestor = require('@edgeguideab/client-request');
const { getPrefix } = require('./utilities');
const config = require('config.json');

export const addField = field => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let nextID = state[view].getIn(['docFields', 'nextID']);
    let fields;
    let newField;
    switch (field) {
      case 'NEW_ENCRYPTED_TEXT':
        fields = state[view].getIn(['docFields', 'encryptedTexts']);
        newField = {
          value: '',
          label: 'Encrypted Text',
          error: null,
          id: nextID
        };
        fields = fields.push(fromJS(newField));
        return dispatch({
          type: `${prefix}_NEW_ENCRYPTED_TEXT_FIELD`,
          payload: fields,
          nextID: nextID + 1
        });
      case 'NEW_TEXT':
        fields = state[view].getIn(['docFields', 'texts']);
        newField = {
          value: '',
          label: 'Text',
          error: null,
          id: nextID
        };
        fields = fields.push(fromJS(newField));
        return dispatch({
          type: `${prefix}_NEW_TEXT_FIELD`,
          payload: fields,
          nextID: nextID + 1
        });
      default:
        return dispatch({ type: `${prefix}_ADD_FIELD_ERROR` });
    }
  };
};

export const updateFieldPositon = (fromId, toId) => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_FIELD_POSITION_START'
    });
    const state = getState();
    const encryptedTexts = state.createDocument.getIn([
      'docFields',
      'encryptedTexts'
    ]);
    const texts = state.createDocument.getIn(['docFields', 'texts']);
    const diff = fromId - toId;

    let updatedEncryptedTexts = [];
    let updatedTexts = [];

    if (diff > 0) {
      updatedEncryptedTexts = encryptedTexts.map(text => {
        if (text.get('id') === fromId) return text.set('id', toId);
        else {
          return text.get('id') < fromId && text.get('id') >= toId
            ? text.set('id', text.get('id') + 1)
            : text;
        }
      });
      updatedTexts = texts.map(text => {
        if (text.get('id') === fromId) return text.set('id', toId);
        else {
          return text.get('id') < fromId && text.get('id') >= toId
            ? text.set('id', text.get('id') + 1)
            : text;
        }
      });
    } else {
      debugger;
      updatedEncryptedTexts = encryptedTexts.map(text => {
        if (text.get('id') === fromId) return text.set('id', toId);
        else {
          return text.get('id') > fromId && text.get('id') <= toId
            ? text.set('id', text.get('id') - 1)
            : text;
        }
      });
      updatedTexts = texts.map(text => {
        if (text.get('id') === fromId) return text.set('id', toId);
        else {
          return text.get('id') > fromId && text.get('id') <= toId
            ? text.set('id', text.get('id') - 1)
            : text;
        }
      });
    }
    dispatch({
      type: 'UPDATE_FIELD_POSITION_SUCCESS',
      payload: { updatedEncryptedTexts, updatedTexts }
    });
  };
};

export const removeField = id => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let encryptedTexts = state[view].getIn(['docFields', 'encryptedTexts']);
    let texts = state[view].getIn(['docFields', 'texts']);
    let encryptedIndex = encryptedTexts.findIndex(
      field => field.get('id') === id
    );
    let textIndex = texts.findIndex(field => field.get('id') === id);
    if (encryptedIndex !== -1)
      encryptedTexts = encryptedTexts.splice(encryptedIndex, 1);
    if (textIndex !== -1) texts = texts.splice(textIndex, 1);
    return dispatch({
      type: `${prefix}_REMOVE_FIELD`,
      encryptedTexts,
      texts
    });
  };
};

export const docInputChange = (inputID, inputValue, type) => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let fields;
    let index;
    switch (type) {
      case 'title':
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_TITLE`,
          payload: inputValue
        });
      case 'encryptedText':
        fields = state[view].getIn(['docFields', 'encryptedTexts']);
        index = fields.findIndex(field => field.get('id') === inputID);
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_ENCRYPTED_TEXT`,
          index,
          value: inputValue
        });
      case 'text': {
        fields = state[view].getIn(['docFields', 'texts']);
        index = fields.findIndex(field => field.get('id') === inputID);
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_TEXT`,
          index,
          value: inputValue
        });
      }
      default:
        return dispatch({ type: `${prefix}_DOC_INPUT_CHANGE_ERROR` });
    }
  };
};

let typingTimeout;
let lastEvent;
let typingWindow = 500;
export const docTitleChange = value => {
  return async dispatch => {
    if (!value) {
      clearTimeout(typingTimeout);
      return dispatch({
        type: 'DOCUMENT_TITLE_LOOKUP_MISSING_TITLE'
      });
    }

    if (value.length < 3) {
      clearTimeout(typingTimeout);
      return dispatch({
        type: 'DOCUMENT_TITLE_LOOKUP_TITLE_TOO_SHORT'
      });
    }
    let now = new Date().valueOf();

    if (!lastEvent) {
      return setTypingTimeout();
    }

    if (now - lastEvent < typingWindow) {
      clearTimeout(typingTimeout);
      dispatch({
        type: 'DOCUMENT_TITLE_LOOKUP_RESTART_TIMEOUT'
      });
      setTypingTimeout();
    } else {
      setTypingTimeout();
    }

    function setTypingTimeout() {
      lastEvent = new Date().valueOf();
      typingTimeout = setTimeout(async () => {
        dispatch({
          type: 'DOCUMENT_TITLE_LOOKUP_START'
        });
        try {
          let response = await requestor.get(
            `${config.server}/document/check/title`,
            {
              query: {
                searchString: value
              }
            }
          );
          dispatch({
            type: 'DOCUMENT_TITLE_LOOKUP_DONE',
            payload: {
              hits: response.body
            }
          });
        } catch (error) {
          dispatch({
            type: 'DOCUMENT_TITLE_LOOKUP_ERROR',
            payload: {
              error: error
            }
          });
        }
      }, typingWindow);
    }
  };
};

export const clearSimilarDocuments = () => {
  return {
    type: 'DOCUMENT_TITLE_LOOKUP_CLEAR'
  };
};

export default {
  addField,
  removeField,
  docInputChange,
  docTitleChange,
  updateFieldPositon,
  clearSimilarDocuments
};
