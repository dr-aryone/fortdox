const requestor = require('@edgeguideab/requestor');

const createDocument = () => {
  return async (dispatch, getState) => {
    let state = getState();
    let title = state.form.get('titleValue');
    let text = state.form.get('textValue');
    dispatch({
      type: 'SEND_FORM_START'
    });
    try {
      await requestor.post('http://localhost:8000/user/createDocument', {
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
    let document = state.search.get('documentToUpdate');
    dispatch({
      type: 'UPDATE_DOCUMENT_START'
    });
    debugger;
    try {
      await requestor.post('http://localhost:8000/user/updateDocument', {
        index: document.get('_index'),
        type: document.get('_type'),
        source: {
          title: document.getIn(['_source', 'title']),
          text: document.getIn(['_source', 'text'])
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

// const form = () => {
//   return (dispatch, getState) => {
//     let state = getState();
//     return state.search.get('documentToUpdate') === null ? createDocument() : updateDocument();
//   };
// };
module.exports = {updateDocument, createDocument};
