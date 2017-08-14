const {fromJS} = require('immutable');
const {getPrefix} = require('./utilities');

const addField = field => {
  return (dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
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
          nextID: nextID+1
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
          nextID: nextID+1
        });
    }
  };
};

const removeField = id => {
  return (dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
    let encryptedTexts = state[view].getIn(['docFields', 'encryptedTexts']);
    let texts = state[view].getIn(['docFields', 'texts']);
    let encryptedIndex = encryptedTexts.findIndex(field => field.get('id') === id);
    let textIndex = texts.findIndex(field => field.get('id') === id);
    if (encryptedIndex !== -1) encryptedTexts = encryptedTexts.splice(encryptedIndex, 1);
    if (textIndex !== -1) texts = texts.splice(textIndex, 1);
    return dispatch({
      type: `${prefix}_REMOVE_FIELD`,
      encryptedTexts,
      texts
    });
  };
};

const docInputChange = (inputID, inputValue, type) => {
  return (dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
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
        index = fields.findIndex(field => field.get('id') == inputID);
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_ENCRYPTED_TEXT`,
          index,
          value: inputValue
        });
      case 'text': {
        fields = state[view].getIn(['docFields', 'texts']);
        index = fields.findIndex(field => field.get('id') == inputID);
        return dispatch({
          type: `${prefix}_INPUT_CHANGE_TEXT`,
          index,
          value: inputValue
        });
      }
    }
  };
};

module.exports = {
  addField,
  removeField,
  docInputChange
};
