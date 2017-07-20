const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');
const checkEmptyFields = require('actions/utilities/checkEmptyFields');
const embedPrivateKey = require('actions/utilities/embedPrivateKey');

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

    let body = {};
    docFields.entrySeq().forEach((entry) => body[entry[0]] = entry[1].get('value'));
    try {
      await requestor.post(`${config.server}/document`, {
        body: {
          body,
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

module.exports = {updateDocument, createDocument, deleteDocument};
