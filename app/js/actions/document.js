const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');
const checkEmptyFields = require('actions/utilities/checkEmptyFields');
const embedPrivateKey = require('actions/utilities/embedPrivateKey');

const setUpdateDocument = id => {
  return (dispatch, getState) => {
    let state = getState();
    let searchResult = state.search.get('result');
    let doc;
    searchResult.forEach((entry) => {
      if (entry.get('_id') === id) doc = entry;
    });
    let docFields = {};
    let tags = [];
    doc.get('_source').entrySeq().forEach(([key, value]) => {
      if (key === 'tags') tags = value;
      else {
        let label = key == 'title' ? 'Title' : 'Text';
        docFields[key] = {
          value,
          label,
          error: null
        };
      }
    });
    dispatch({
      type: 'SET_UPDATE_DOCUMENT',
      payload: {
        documentToUpdate: doc,
        docFields,
        tags
      }
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
    let emptyFields = checkEmptyFields(docFields);
    if (emptyFields.length > 0) {
      let newDocFields = {};
      emptyFields.forEach((key) => {
        newDocFields[key[0]] = {
          error: `Please enter a ${key[1].get('label').toLowerCase()}.`
        };
      });

      return dispatch({
        type: 'CREATE_DOCUMENT_ERROR',
        payload: newDocFields
      });
    }

    let doc = {};
    docFields.entrySeq().forEach((entry) => doc[entry[0]] = entry[1].get('value'));
    let tags = state.createDocument.getIn(['tags', 'list']);
    try {
      await requestor.post(`${config.server}/document`, {
        body: {
          doc,
          tags,
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
    let oldDoc = state.updateDocument.get('documentToUpdate');
    let newDoc = state.updateDocument.get('docFields');
    let tags = state.updateDocument.getIn(['tags', 'list']);
    let privateKey = state.user.get('privateKey');
    let email = state.user.get('email');
    let emptyFields = checkEmptyFields(newDoc);
    if (emptyFields.length > 0) {
      let newDocFields = {};
      emptyFields.forEach((entry) => {
        newDocFields[entry[0]] = {
          error: `${entry[1].get('label')} can not be empty.`
        };
      });
      return dispatch({
        type: 'UPDATE_DOCUMENT_ERROR',
        payload: newDocFields
      });
    }
    let updateQuery = {};
    newDoc.entrySeq().forEach((entry) => updateQuery[entry[0]] = entry[1].get('value'));
    try {
      await requestor.patch(`${config.server}/document`, {
        body:{
          index: oldDoc.get('_index'),
          type: oldDoc.get('_type'),
          id: oldDoc.get('_id'),
          updateQuery,
          email,
          tags
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

const addTag = () => {
  return (dispatch, getState) => {
    dispatch({
      type: 'ADD_TAG_START'
    });
    let state = getState();
    let currentView = state.navigation.get('currentView');
    let tagList;
    let tag;
    switch (currentView) {
      case 'CREATE_DOC_VIEW':
        tagList = state.createDocument.getIn(['tags', 'list']);
        tag = state.createDocument.getIn(['tags', 'value']);
        break;
      case 'UPDATE_DOC_VIEW':
        tagList = state.updateDocument.getIn(['tags', 'list']);
        tag = state.updateDocument.getIn(['tags', 'value']);
        break;
    }
    if (tag.trim() === '') return;
    tagList = tagList.push(tag);

    if (currentView === 'CREATE_DOC_VIEW') return dispatch({
      type: 'CREATE_DOC_ADD_TAG_SUCCESS',
      payload: tagList
    });
    else return dispatch({
      type: 'UPDATE_DOC_ADD_TAG_SUCCESS',
      payload: tagList
    });
  };
};

const removeTag = tagIndex => {
  return (dispatch, getState) => {
    dispatch({
      type: 'REMOVE_TAG_START'
    });
    let state = getState();
    let currentView = state.navigation.get('currentView');
    let tagList;
    if (currentView === 'CREATE_DOC_VIEW') {
      tagList = state.createDocument.getIn(['tags', 'list']);
      tagList = tagList.splice(tagIndex, 1);
      return dispatch({
        type: 'CREATE_DOC_REMOVE_TAG_SUCCESS',
        payload: tagList
      });
    } else {
      tagList = state.updateDocument.getIn(['tags', 'list']);
      tagList = tagList.splice(tagIndex, 1);
      return dispatch({
        type: 'UPDATE_DOC_REMOVE_TAG_SUCCESS',
        payload: tagList
      });
    }
  };
};

const getOldTags = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_OLD_TAGS_START'
    });
    let response;
    try {
      response = await requestor.get(`${config.server}/tags`);
    } catch (error) {
      console.error(error);
      switch (error.status) {
        case 400:
        case 404:
        case 408:
        case 500:
          return dispatch({
            type: 'GET_OLD_TAGS_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }
    return dispatch({
      type: 'GET_OLD_TAGS_SUCCESS',
      payload: response.body
    });
  };
};

module.exports = {
  setUpdateDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  addTag,
  removeTag,
  getOldTags
};
