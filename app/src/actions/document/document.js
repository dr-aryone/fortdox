import { getPrefix, htmlToMarkdown, markdownToHtml } from './utilities';
import { changeView } from 'actions';
const { fromJS } = require('immutable');
const requestor = require('@edgeguideab/client-request');
const config = require('config.json');

export default {
  createDocument,
  updateDocument,
  previewDocument,
  deleteDocument,
  openDocument,
  hasChecked,
  unCheck,
  toggleVersionPanel,
  insertDocumentVersion
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
      const value =
        field.get('format') === 'html'
          ? htmlToMarkdown(field.get('value'))
          : field.get('value');
      encryptedTexts.push({
        text: value,
        id: field.get('id')
      });
    });
    docFields.getIn(['texts']).forEach(field => {
      const value =
        field.get('format') === 'html'
          ? htmlToMarkdown(field.get('value'))
          : field.get('value');
      texts.push({
        text: value,
        id: field.get('id')
      });
    });

    docFields.getIn(['attachments']).forEach(attachment => {
      attachments.push({
        name: attachment.name,
        file: attachment.file,
        file_type: attachment.type
      });
    });

    let form = new FormData();
    docFields.getIn(['files']).forEach(a => {
      form.append('attachments[]', a.actualFile);
    });

    form.set('title', title);
    form.set('encryptedTexts', JSON.stringify(encryptedTexts));
    form.set('texts', JSON.stringify(texts));
    form.set('tags', tags);

    let response;
    try {
      response = await requestor.post(`${config.server}/document`, {
        body: form
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
        const state = getState();
        const docFields = state.updateDocument.get('docFields');
        const encryptedTexts = docFields
          .get('encryptedTexts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );
        const texts = docFields
          .get('texts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );

        return dispatch({
          type: 'CREATE_DOCUMENT_SUCCESS',
          payload: {
            docFields,
            encryptedTexts,
            texts,
            message: 'Document has been created!'
          }
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
      const value =
        field.get('format') === 'html'
          ? htmlToMarkdown(field.get('value'))
          : field.get('value');
      encryptedTexts.push({
        text: value,
        id: field.get('id')
      });
    });
    newDoc.getIn(['texts']).forEach(field => {
      const value =
        field.get('format') === 'html'
          ? htmlToMarkdown(field.get('value'))
          : field.get('value');
      texts.push({
        text: value,
        id: field.get('id')
      });
    });
    newDoc.getIn(['attachments']).forEach(attachment => {
      if (attachment.get('new')) {
        return;
      }
      attachments.push({
        name: attachment.get('name'),
        id: attachment.get('id'),
        file_type: attachment.get('type')
      });
    });

    let oldDoc = state.updateDocument.get('documentToUpdate');

    let form = new FormData();
    newDoc.getIn(['files']).forEach(a => {
      form.append('attachments[]', a.actualFile);
    });

    form.set('title', title);
    form.set('encryptedTexts', JSON.stringify(encryptedTexts));
    form.set('texts', JSON.stringify(texts));
    form.set('tags', tags);
    form.set('attachments', JSON.stringify(attachments));

    try {
      await requestor.patch(`${config.server}/document/${oldDoc.get('_id')}`, {
        body: form
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

    return dispatch(
      openDocument(oldDoc.get('_id'), true, () => {
        let state = getState();
        let docFields = state.updateDocument.get('docFields');
        const encryptedTexts = docFields
          .get('encryptedTexts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );
        const texts = docFields
          .get('texts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );
        return dispatch({
          type: 'UPDATE_DOCUMENT_SUCCESS',
          payload: {
            message: 'Document has been updated!',
            encryptedTexts,
            texts,
            docFields
          }
        });
      })
    );
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
      return dispatch({
        type: 'OPEN_DOCUMENT_ERROR',
        payload: 'Unable to open document.'
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
      let files = [];
      let nextID = 0;
      doc._source.encrypted_texts.forEach(entry => {
        encryptedTexts.push(
          fromJS({
            value: markdownToHtml(entry.text),
            id: entry.id,
            label: 'Encrypted Text',
            error: null,
            format: 'html'
          })
        );
        if (entry.id > nextID) nextID = entry.id;
      });
      doc._source.texts.forEach(entry => {
        texts.push(
          fromJS({
            value: markdownToHtml(entry.text),
            id: entry.id,
            label: 'Text',
            error: null,
            format: 'html'
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
          id: attachment.id,
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
        files,
        versions: doc._source.versions,
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
        const encryptedTexts = docFields
          .get('encryptedTexts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );
        const texts = docFields
          .get('texts')
          .map(text =>
            text
              .set('value', htmlToMarkdown(text.get('value')))
              .set('format', 'markdown')
          );
        return dispatch({
          type: 'PREVIEW_DOCUMENT_SUCCESS',
          payload: {
            docFields,
            encryptedTexts,
            texts
          }
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

  return { titleError, emptyFieldIDs, emptyFieldError, hasChecked };
}

export function hasChecked(nextView) {
  return (dispatch, getState) => {
    const state = getState();
    const currentView = state.navigation.get('currentView');
    const { view, prefix } = getPrefix(currentView);
    dispatch({
      type: `${prefix}_FIELDS_CHECKED`
    });

    dispatch(
      changeView(nextView ? nextView : state[view].get('nextViewAfterCheck'))
    );
  };
}

export function unCheck() {
  return (dispatch, getState) => {
    const state = getState();
    const currentView = state.navigation.get('currentView');
    const { prefix } = getPrefix(currentView);
    dispatch({ type: `${prefix}_UNCHECK_FIELD` });
  };
}

export function toggleVersionPanel(toggle) {
  return (dispatch, getState) => {
    const state = getState();
    const showVersionPanel = state.updateDocument.get('showVersionPanel');
    dispatch({
      type: 'TOGGLE_VERSION_HISTORY',
      payload: toggle ? toggle : !showVersionPanel
    });
  };
}

export function insertDocumentVersion(version) {
  return dispatch => {
    let title = {
      value: version.get('title'),
      id: 'title',
      label: 'Title',
      error: null
    };
    let encryptedTexts = [];
    let texts = [];
    let tags = [];
    let attachments = [];
    let nextID = 0;
    version.get('encrypted_texts').forEach(entry => {
      encryptedTexts.push(
        fromJS({
          value: entry.get('text'),
          id: entry.get('id'),
          label: 'Encrypted Text',
          error: null
        })
      );
      if (entry.get('id') > nextID) nextID = entry.get('id');
    });
    version.get('texts').forEach(entry => {
      texts.push(
        fromJS({
          value: entry.get('text'),
          id: entry.get('id'),
          label: 'Text',
          error: null
        })
      );
      if (entry.get('id') > nextID) nextID = entry.get('id');
    });
    version.get('tags').forEach(entry => {
      tags.push(entry);
    });

    version.get('attachments').forEach(attachment => {
      attachments.push({
        name: attachment.get('name'),
        id: attachment.get('id'),
        file: attachment.get('file'),
        type: attachment.get('file_type')
      });
    });

    dispatch({
      type: 'INSERT_DOCUMENT_VERSION',
      payload: {
        title,
        encryptedTexts,
        texts,
        attachments,
        tags,
        nextID: nextID + 1
      }
    });
  };
}
