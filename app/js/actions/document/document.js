const {fromJS} = require('immutable');
const requestor = require('@edgeguideab/client-request');
const config = require('../../../config.json');

module.exports = {
  setUpdateDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  openDocument
};

function setUpdateDocument(id, document) {
  return (dispatch, getState) => {
    let state = getState();
    let searchResult = state.search.get('result');
    let doc = document;
    if (!document) {
      doc = searchResult.find(entry => entry.get('_id') === id);
    }
    let title = {
      value: doc.getIn(['_source', 'title']),
      id: 'title',
      label: 'Title',
      error: null
    };
    let encryptedTexts = [];
    let texts = [];
    let tags = [];
    let attachments = [];
    let nextID = 0;
    doc.getIn(['_source', 'encrypted_texts']).forEach(entry => {
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
    doc.getIn(['_source', 'attachments']).forEach(attachment => {
      attachments.push({
        name: attachment.get('name'),
        file: attachment.get('file'),
        type: attachment.get('file_type'),
      });
    });
    return dispatch({
      type: 'SET_UPDATE_DOCUMENT',
      documentToUpdate: doc,
      title,
      encryptedTexts,
      texts,
      tags,
      attachments,
      nextID: nextID+1
    });
  };
}

function createDocument() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'CREATE_DOCUMENT_START'
    });
    let state = getState();
    let docFields = state.createDocument.get('docFields');
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
    let attachments = [];
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
    docFields.getIn(['attachments']).forEach(attachment => {
      attachments.push({
        name: attachment.get('name'),
        file: attachment.get('file'),
        file_type: attachment.get('type')
      });
    });

    try {
      await requestor.post(`${config.server}/document`, {
        body: {
          doc: {
            title,
            encryptedTexts,
            texts,
            tags,
            attachments
          },
          email
        }
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
}

function updateDocument() {
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
    let attachments = [];
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
    newDoc.getIn(['attachments']).forEach(attachment => {
      attachments.push({
        name: attachment.get('name'),
        file: attachment.get('file'),
        file_type: attachment.get('type')
      });
    });
    let oldDoc = state.updateDocument.get('documentToUpdate');
    let email = state.user.get('email');
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
            tags,
            attachments
          },
          email
        }
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
}

function deleteDocument() {
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
}

function openDocument(id) {
  return async dispatch => {
    dispatch({
      type: 'OPEN_DOCUMENT_START'
    });
    let response;
    try {
      response = await requestor.get(`${config.server}/document/${id}`);
      dispatch({
        type: 'OPEN_DOCUMENT_DONE',
        payload: {
          document: response.body
        }
      });
      dispatch(setUpdateDocument(id, fromJS(response.body)));
    } catch (error) {
      dispatch({
        type: 'OPEN_DOCUMENT_ERROR'
      });
    }
  };
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
