const requestor = require('@edgeguideab/client-request');
const config = require('../../config.json');

const createDocument = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: 'CREATE_DOCUMENT_START'
    });
    let state = getState();
    let title = state.createDocument.get('titleValue');
    let text = state.createDocument.get('textValue');
    let privateKey = state.user.get('privateKey');
    let email = state.user.get('email');
    
    if (!title) return dispatch ({
      type: 'CREATE_DOCUMENT_ERROR',
      payload: 'Title cannot be empty.'
    });

    if (!text) return dispatch ({
      type: 'CREATE_DOCUMENT_ERROR',
      payload: 'Text cannot be empty.'
    });

    try {
      await requestor.post(`${config.server}/documents`, {
        body: {
          body: {
            title,
            text
          },
          email
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'CREATE_DOCUMENT_ERROR',
        payload: 'Cannot connect to the server. Try again later.'
      });
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
    let newDoc = state.updateDocument;
    let privateKey = state.user.get('privateKey');
    let email = state.user.get('email');
    if (!newDoc.title) return dispatch ({
      type: 'CREATE_DOCUMENT_ERROR',
      payload: 'Title cannot be empty.'
    });

    if (!newDoc.text) return dispatch ({
      type: 'CREATE_DOCUMENT_ERROR',
      payload: 'Text cannot be empty.'
    });

    try {
      await requestor.patch(`${config.server}/documents`, {
        body:{
          index: oldDoc.get('_index'),
          type: oldDoc.get('_type'),
          id: oldDoc.get('_id'),
          updateQuery: {
            title: newDoc.get('titleValue'),
            text: newDoc.get('textValue')
          },
          email
        },
        headers: {
          'Authorization': `FortDoks ${privateKey}`
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'UPDATE_DOCUMENT_ERROR'
      });
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
      await requestor.delete(`${config.server}/documents`, {
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
