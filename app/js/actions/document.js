const requestor = require('@edgeguideab/client-request');

const createDocument = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let title = state.form.get('titleValue');
    let text = state.form.get('textValue');
    dispatch({
      type: 'SEND_FORM_START'
    });
    try {
      await requestor.post('http://localhost:8000/documents', {
        index: 'document',
        type: 'form',
        body: {
          title,
          text
        }
      });
      dispatch({
        type: 'SEND_FORM_SUCCESS'
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'SEND_FORM_ERROR'
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
          }
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
        body:{
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
