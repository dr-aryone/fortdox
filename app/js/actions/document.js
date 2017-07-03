const requestor = require('@edgeguideab/client-request');
const fs = window.require('fs');
const privateKey = fs.readFileSync('./js/local_storage/private_key.pem', 'utf-8');

const createDocument = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let title = state.createDocument.get('titleValue');
    let text = state.createDocument.get('textValue');
    dispatch({
      type: 'CREATE_DOCUMENT_START'
    });

    try {
      await requestor.post('http://localhost:8000/documents', {
        body: {
          index: 'document',
          type: 'form',
          body: {
            title,
            text
          },
          privateKey
        }
      });
      dispatch({
        type: 'CREATE_DOCUMENT_SUCCESS'
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'CREATE_DOCUMENT_ERROR'
      });
    }
  };
};

const updateDocument = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let doc = state.search.get('documentToUpdate');
    let newDoc = state.updateDocument;
    dispatch({
      type: 'UPDATE_DOCUMENT_START'
    });
    try {
      await requestor.patch('http://localhost:8000/documents', {
        body:{
          index: doc.get('_index'),
          type: doc.get('_type'),
          id: doc.get('_id'),
          updateQuery: {
            title: newDoc.get('titleValue'),
            text: newDoc.get('textValue')
          },
          privateKey
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'UPDATE_DOCUMENT_ERROR'
      });
    }
    return dispatch({
      type: 'UPDATE_DOCUMENT_SUCCESS'
    });
  };
};

const deleteDocument = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let doc = state.search.get('documentToUpdate');
    dispatch({
      type: 'DELETE_DOCUMENT_START'
    });
    try {
      await requestor.delete('http://localhost:8000/documents', {
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
