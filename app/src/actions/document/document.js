const { fromJS } = require('immutable');
const requestor = require('@edgeguideab/client-request');
const config = require('config.json');

export default {
  createDocument,
  updateDocument,
  previewDocument,
  deleteDocument,
  openDocument
};

export function createDocument() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'CREATE_DOCUMENT_START'
    });
    let state = getState();
    let docFields = state.createDocument.get('docFields');
    let { titleError, emptyFieldIDs, emptyFieldError } = checkEmptyDocFields(
      docFields
    );
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

    let response;
    try {
      response = await requestor.post(`${config.server}/document`, {
        body: {
          title,
          encryptedTexts,
          texts,
          tags,
          attachments
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
        default:
          return dispatch({
            type: 'CREATE_DOCUMENT_ERROR',
            payload: 'Cannot connect to the server. Please try again later.'
          });
      }
    }

    return dispatch(
      openDocument(response.body._id, true, () => {
        let state = getState();
        let docFields = state.updateDocument.get('docFields');
        return dispatch({
          type: 'CREATE_DOCUMENT_SUCCESS',
          payload: 'Document has been created!',
          docFields
        });
      })
    );
  };
}

export function updateDocument() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_DOCUMENT_START'
    });
    let state = getState();
    let newDoc = state.updateDocument.get('docFields');
    let { titleError, emptyFieldIDs, emptyFieldError } = checkEmptyDocFields(
      newDoc
    );
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

    try {
      await requestor.patch(`${config.server}/document/${oldDoc.get('_id')}`, {
        body: {
          type: oldDoc.get('_type'),
          title,
          encryptedTexts,
          texts,
          tags,
          attachments
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
        default:
          return dispatch({
            type: 'UPDATE_DOCUMENT_ERROR',
            payload: 'Unable to connect to server. Please try again later.'
          });
      }
    }

    return dispatch({
      type: 'UPDATE_DOCUMENT_SUCCESS',
      payload: 'Document updated!',
      docFields: newDoc
    });
  };
}

export function deleteDocument() {
  return async (dispatch, getState) => {
    dispatch({
      type: 'DELETE_DOCUMENT_START'
    });
    let state = getState();
    let doc = state.updateDocument.get('documentToUpdate');
    try {
      await requestor.delete(`${config.server}/document/${doc.get('_id')}`, {
        query: {
          index: doc.get('_index'),
          type: doc.get('_type')
        }
      });
    } catch (error) {
      console.error(error);
      return dispatch({
        type: 'DELETE_DOCUMENT_ERROR',
        payload: 'Unable to delete document.'
      });
    }
    dispatch({
      type: 'DELETE_DOCUMENT_SUCCESS',
      payload: 'Document was deleted!'
    });
  };
}

const MINIMUM_LOADING_TIME = 200;
export function openDocument(id, skipTimeout, showPreview) {
  return async dispatch => {
    dispatch({
      type: 'OPEN_DOCUMENT_START'
    });
    let startTime = new Date().valueOf();
    let response;
    try {
      response = await requestor.get(`${config.server}/document/${id}`);
      let endTime = new Date().valueOf();
      let timeout = 0;
      if (endTime - startTime < MINIMUM_LOADING_TIME) {
        timeout = MINIMUM_LOADING_TIME - (endTime - startTime);
      }
      if (skipTimeout) {
        timeout = 0;
      }
      setTimeout(() => {
        setUpdateDocument(response.body, showPreview);
      }, timeout);
    } catch (error) {
      dispatch({
        type: 'OPEN_DOCUMENT_ERROR'
      });
    }

    function setUpdateDocument(doc, showPreview) {
      let title = {
        value: doc._source.title,
        id: 'title',
        label: 'Title',
        error: null
      };
      let encryptedTexts = [];
      let texts = [];
      let tags = [];
      let attachments = [];
      let nextID = 0;
      doc._source.encrypted_texts.forEach(entry => {
        encryptedTexts.push(
          fromJS({
            value: entry.text,
            id: entry.id,
            label: 'Encrypted Text',
            error: null
          })
        );
        if (entry.id > nextID) nextID = entry.id;
      });
      doc._source.texts.forEach(entry => {
        texts.push(
          fromJS({
            value: entry.text,
            id: entry.id,
            label: 'Text',
            error: null
          })
        );
        if (entry.id > nextID) nextID = entry.id;
      });
      doc._source.tags.forEach(entry => {
        tags.push(entry);
      });
      doc._source.attachments.forEach(attachment => {
        attachments.push({
          name: attachment.name,
          file: attachment.file,
          type: attachment.file_type
        });
      });
      dispatch({
        type: 'OPEN_DOCUMENT_DONE',
        documentToUpdate: doc,
        title,
        encryptedTexts,
        texts,
        tags,
        attachments,
        changelog: doc.logentries,
        nextID: nextID + 1
      });
      if (showPreview) showPreview();
    }
  };
}

export function previewDocument(id, skipTimeout) {
  return async (dispatch, getState) => {
    dispatch({
      type: 'PREVIEW_DOCUMENT_START'
    });
    dispatch(
      openDocument(id, skipTimeout, () => {
        let state = getState();
        let docFields = state.updateDocument.get('docFields');
        return dispatch({
          type: 'PREVIEW_DOCUMENT_SUCCESS',
          docFields
        });
      })
    );
  };
}

export function checkEmptyDocFields(docFields) {
  let titleField = docFields.get('title');
  let encryptedTextFields = docFields.get('encryptedTexts');
  let textFields = docFields.get('texts');

  let emptyFieldIDs = [];
  let titleError = null;
  let emptyFieldError = 'Please enter a text.';
  if (titleField.get('value').trim() === '')
    titleError = 'Please enter a title.';
  encryptedTextFields.valueSeq().forEach(field => {
    if (field.get('value').trim() === '') emptyFieldIDs.push(field.get('id'));
  });
  textFields.valueSeq().forEach(field => {
    if (field.get('value').trim() === '') emptyFieldIDs.push(field.get('id'));
  });

  return { titleError, emptyFieldIDs, emptyFieldError };
}
