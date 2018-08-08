const { fromJS } = require('immutable');
const requestor = require('@edgeguideab/client-request');
const { getPrefix, markdownToHtml, htmlToMarkdown } = require('./utilities');
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
          id: nextID,
          format: 'html'
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
          id: nextID,
          format: 'html'
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
    const state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_UPDATE_FIELD_POSITION_START`
    });

    const encryptedTexts = state[view].getIn(['docFields', 'encryptedTexts']);
    const texts = state[view].getIn(['docFields', 'texts']);
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
      type: `${prefix}_UPDATE_FIELD_POSITION_SUCCESS`,
      payload: { updatedEncryptedTexts, updatedTexts, toId }
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

export const docInputChange = (inputId, inputValue, type) => {
  return (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let fields;
    let updatedFields;
    switch (type) {
      case 'title':
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_TITLE`,
          payload: inputValue
        });
      case 'encryptedText':
        fields = state[view].getIn(['docFields', 'encryptedTexts']);
        updatedFields = fields.map(text => {
          return text.get('id') === parseInt(inputId, 10)
            ? text.set('value', inputValue).set('error', null)
            : text;
        });
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_ENCRYPTED_TEXT`,
          payload: updatedFields
        });
      case 'text': {
        fields = state[view].getIn(['docFields', 'texts']);
        updatedFields = fields.map(text => {
          return text.get('id') === parseInt(inputId, 10)
            ? text.set('value', inputValue).set('error', null)
            : text;
        });
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_TEXT`,
          payload: updatedFields
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

export const onDrop = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const currentView = state.navigation.get('currentView');
    const { prefix } = getPrefix(currentView);
    return dispatch({
      type: `${prefix}_FIELD_DROPPED`
    });
  };
};

export const onHideElement = id => {
  return async (dispatch, getState) => {
    const state = getState();
    const currentView = state.navigation.get('currentView');
    const { prefix } = getPrefix(currentView);
    return dispatch({
      type: `${prefix}_HIDE_ELEMENT`,
      payload: id
    });
  };
};

export function convertFormat(id, type, format) {
  return (dispatch, getState) => {
    const state = getState();
    const currentView = state.navigation.get('currentView');
    const { view, prefix } = getPrefix(currentView);
    const field = state[view].getIn(['docFields', type + 's']);

    if (!field)
      return dispatch({
        type: `${prefix}_CONVERT_FIELD_ERROR`,
        payload: 'Unable to change format.'
      });

    const updatedFields = field.map(text => {
      if (text.get('id') === id) {
        const value =
          format === 'html'
            ? markdownToHtml(text.get('value'))
            : htmlToMarkdown(text.get('value'));
        return text
          .set('value', value)
          .set('format', format === 'html' ? 'html' : 'markdown');
      } else {
        return text;
      }
    });

    if (type === 'text')
      return dispatch({
        type: `${prefix}_CONVERTED_TEXT`,
        payload: updatedFields
      });
    else
      return dispatch({
        type: `${prefix}_CONVERTED_ENCRYPTED_TEXT`,
        payload: updatedFields
      });
  };
}

export default {
  addField,
  removeField,
  docInputChange,
  docTitleChange,
  updateFieldPositon,
  clearSimilarDocuments,
  onDrop,
  onHideElement,
  convertFormat
};
