const requestor = require('@edgeguideab/client-request');

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
          }
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

module.exports = {updateDocument, createDocument};
