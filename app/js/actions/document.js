const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');
const embedPrivateKey = require('actions/utilities/embedPrivateKey');
const {fromJS} = require('immutable');

const setUpdateDocument = id => {
  return (dispatch, getState) => {
    let state = getState();
    let searchResult = state.search.get('result');
    let doc = searchResult.find(entry => entry.get('_id') === id);
    let title = {
      value: doc.getIn(['_source', 'title']),
      id: 'title',
      label: 'Title',
      error: null
    };
    let encryptedTexts = [];
    let texts = [];
    let tags = [];
    let nextID = 0;
    doc.getIn(['_source', 'encryptedTexts']).forEach(entry => {
      encryptedTexts.push(fromJS({
        value: entry.get('text'),
        id: entry.get('id'),
        label: 'Encrypted Text',
        error: null
      }));
      if (entry.get('id') > nextID) nextID = entry.get('id');
    });
    doc.getIn(['_source', 'texts']).forEach(entry => {
      texts.push(fromJS({
        value: entry.get('text'),
        id: entry.get('id'),
        label: 'Text',
        error: null
      }));
      if (entry.get('id') > nextID) nextID = entry.get('id');
    });
    doc.getIn(['_source', 'tags']).forEach(entry => {
      tags.push(entry);
    });
    return dispatch({
      type: 'SET_UPDATE_DOCUMENT',
      documentToUpdate: doc,
      title,
      encryptedTexts,
      texts,
      tags,
      nextID: nextID+1
    });
  };
};

const createDocument = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'CREATE_DOCUMENT_START'
    });
    let state = getState();
    let docFields = state.createDocument.get('docFields');
    let privateKey = state.user.get('privateKey');
    let email = state.user.get('email');
    let {titleError, emptyFieldIDs, emptyFieldError} = checkEmptyDocFields(docFields);
    if (titleError !== null || emptyFieldIDs.length !== 0) {
      return dispatch({
        type: 'CREATE_DOCUMENT_FAIL',
        titleError,
        emptyFieldIDs,
        emptyFieldError
      });
    }
    let title = docFields.getIn(['title', 'value']);
    let encryptedTexts = [];
    let texts = [];
    let tags = docFields.getIn(['tags', 'list']).toJS();
    docFields.getIn(['encryptedTexts']).forEach(field => {
      encryptedTexts.push({
        text: field.get('value'),
        id: field.get('id')
      });
    });
    docFields.getIn(['texts']).forEach(field => {
      texts.push({
        text: field.get('value'),
        id: field.get('id')
      });
    });

    try {
      await requestor.post(`${config.server}/document`, {
        body: {
          doc: {
            title,
            encryptedTexts,
            texts,
            tags
          },
          email
        },
        headers: embedPrivateKey(privateKey)
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 409:
        case 404:
          return dispatch({
            type: 'CREATE_DOCUMENT_ERROR',
            payload: 'Bad request. Please try again.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'CREATE_DOCUMENT_ERROR',
            payload: 'Cannot connect to the server. Please try again later.'
          });
      }
    }

    return dispatch({
      type: 'CREATE_DOCUMENT_SUCCESS',
      payload: 'Document created!'
    });
  };
};

const updateDocument = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_DOCUMENT_START'
    });

    let state = getState();
    let newDoc = state.updateDocument.get('docFields');
    let {titleError, emptyFieldIDs, emptyFieldError} = checkEmptyDocFields(newDoc);
    if (titleError !== null || emptyFieldIDs.length !== 0) {
      return dispatch({
        type: 'UPDATE_DOCUMENT_FAIL',
        titleError,
        emptyFieldIDs,
        emptyFieldError
      });
    }
    let title = newDoc.getIn(['title', 'value']);
    let encryptedTexts = [];
    let texts = [];
    let tags = newDoc.getIn(['tags', 'list']).toJS();
    newDoc.getIn(['encryptedTexts']).forEach(field => {
      encryptedTexts.push({
        text: field.get('value'),
        id: field.get('id')
      });
    });
    newDoc.getIn(['texts']).forEach(field => {
      texts.push({
        text: field.get('value'),
        id: field.get('id')
      });
    });
    let oldDoc = state.updateDocument.get('documentToUpdate');
    let email = state.user.get('email');
    let privateKey = state.user.get('privateKey');
    try {
      await requestor.patch(`${config.server}/document`, {
        body:{
          index: oldDoc.get('_index'),
          type: oldDoc.get('_type'),
          id: oldDoc.get('_id'),
          doc: {
            title,
            encryptedTexts,
            texts,
            tags
          },
          email
        },
        headers: embedPrivateKey(privateKey)
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
          return dispatch({
            type: 'UPDATE_DOCUMENT_ERROR',
            payload: 'Bad request. Please try again later.'
          });
        case 408:
        case 500:
          return dispatch({
            type: 'UPDATE_DOCUMENT_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    return dispatch({
      type: 'UPDATE_DOCUMENT_SUCCESS',
      payload: 'Document updated!'
    });
  };
};

const deleteDocument = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DELETE_DOCUMENT_START'
    });

    let state = getState();
    let doc = state.search.get('documentToUpdate');
    try {
      await requestor.delete(`${config.server}/document`, {
        query:{
          index: doc.get('_index'),
          type: doc.get('_type'),
          id: doc.get('_id')
        }
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'DELETE_DOCUMENT_ERROR'
      });
    }
    dispatch({
      type: 'DELETE_DOCUMENT_SUCCESS'
    });
  };
};

const addTag = tag => {
  return (dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_ADD_TAG_START`
    });
    let tagList = state[view].getIn(['docFields', 'tags', 'list']);
    if (tag === undefined) tag = state[view].getIn(['docFields', 'tags', 'value']);
    if (tag.trim() === '') return;
    if (tagList.contains(tag)) return dispatch({
      type: `${prefix}_ADD_TAG_FAIL`,
      payload: `${tag} has already been added.`
    });
    tagList = tagList.push(tag);
    return dispatch({
      type: `${prefix}_ADD_TAG_SUCCESS`,
      payload: tagList
    });
  };
};

const removeTag = tagIndex => {
  return (dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_REMOVE_TAG_SUCCESS`
    });
    let tagList = state[view].getIn(['docFields', 'tags', 'list']);
    tagList = tagList.splice(tagIndex, 1);
    return dispatch({
      type: `${prefix}_REMOVE_TAG_SUCCESS`,
      payload: tagList
    });
  };
};

const getOldTags = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let {prefix} = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_GET_OLD_TAGS_START`
    });
    let organization = state.user.get('organization');
    let response;
    try {
      response = await requestor.get(`${config.server}/tags`, {
        query: {
          organization
        }
      });
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
        case 408:
        case 500:
          return dispatch({
            type: `${prefix}_GET_OLD_TAGS_ERROR`,
            payload: 'Unable to get old tag list.'
          });
      }
    }
    let tagList = [];
    response.body.forEach((tag) => tagList.push(tag.key));
    return dispatch({
      type: `${prefix}_GET_OLD_TAGS_SUCCESS`,
      payload: tagList.sort()
    });
  };
};

const suggestTags = inputValue => {
  return (dispatch, getState) => {
    if (inputValue.slice(-1) === ' ') return dispatch(addTag());
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
    let oldTags = state[view].getIn(['docFields', 'tags', 'old']);
    let suggestedTags = [];
    oldTags.some((tag) => {
      if (tag.startsWith(inputValue)) suggestedTags.push(tag);
      if (suggestedTags.length === 5) return;
    });
    return dispatch({
      type: `${prefix}_INPUT_CHANGE_TAGS`,
      value: inputValue,
      suggestedTags
    });
  };
};

const setTagIndex = index => {
  return dispatch => {
    return dispatch({
      type: 'CREATE_DOCUMENT_SET_TAG_INDEX',
      payload: index
    });
  };
};

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

function getPrefix(currentView) {
  let view;
  let prefix;
  switch (currentView) {
    case 'UPDATE_DOC_VIEW':
      view = 'updateDocument';
      prefix = 'UPDATE_DOC';
      return {view, prefix};
    case 'CREATE_DOC_VIEW':
      view = 'createDocument';
      prefix = 'CREATE_DOC';
      return {view, prefix};
  }
}

function checkEmptyDocFields(docFields) {
  let titleField = docFields.get('title');
  let encryptedTextFields = docFields.get('encryptedTexts');
  let textFields = docFields.get('texts');

  let emptyFieldIDs = [];
  let titleError = null;
  let emptyFieldError = 'Please enter a text.';
  if (titleField.get('value').trim() === '') titleError = 'Please enter a title.';
  encryptedTextFields.valueSeq().forEach(field => {
    if (field.get('value').trim() === '') emptyFieldIDs.push(field.get('id'));
  });
  textFields.valueSeq().forEach(field => {
    if (field.get('value').trim() === '') emptyFieldIDs.push(field.get('id'));
  });

  return {titleError, emptyFieldIDs, emptyFieldError};
}

module.exports = {
  setUpdateDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  addTag,
  removeTag,
  getOldTags,
  suggestTags,
  setTagIndex,
  addField,
  removeField,
  docInputChange
};
