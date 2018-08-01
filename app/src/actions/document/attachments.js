import { getPrefix } from './utilities';
const requestor = require('@edgeguideab/client-request');
const config = require('config.json');
const fs = window.require('fs');
const attachmentUtils = require('../utilities/attachments');
const globalUtils = require('../utilities/global');
const path = require('path');
const uuid = require('uuid');
const { shell } = window.require('electron');

const FILE_MAX_SIZE = 30 * 1000 * 1000;
const FILE_MAX_SIZE_HUMAN = FILE_MAX_SIZE / 1000000;

export const addAttachment = files => {
  return async (dispatch, getState) => {
    let state = getState();
    let { prefix } = getPrefix(state.navigation.get('currentView'));
    for (let file of Array.from(files)) {
      if (file.size > FILE_MAX_SIZE) {
        dispatch({
          type: `${prefix}_ADD_ATTACHMENT_ERROR`,
          payload: {
            error: `The maximum file size of attachments is ${FILE_MAX_SIZE_HUMAN} MB.
            ${file.name} is to large.`,
            file
          }
        });
        continue;
      }

      try {
        dispatch({
          type: `${prefix}_ADD_ATTACHMENT`,
          fileType: file.type,
          name: file.name,
          actualFile: file
        });
      } catch (error) {
        console.error(error);
        dispatch({
          type: `${prefix}_ADD_ATTACHMENT_ERROR`,
          payload: {
            error
          }
        });
      }
    }
  };
};

export const removeAttachment = (index, name) => {
  return async (dispatch, getState) => {
    let state = getState();
    let { view, prefix } = getPrefix(state.navigation.get('currentView'));
    let attachments = state[view].getIn(['docFields', 'attachments']);
    let files = state[view].getIn(['docFields', 'files']);

    attachments = attachments.splice(index, 1);
    files = files.filter(f => f.actualFile.name !== name);
    return dispatch({
      type: `${prefix}_REMOVE_ATTACHMENT`,
      payload: {
        attachments,
        files
      }
    });
  };
};

export const previewAttachment = (attachmentData, attachmentIndex) => {
  return async (dispatch, getState) => {
    let state = getState();
    let { prefix } = getPrefix(state.navigation.get('currentView'));
    dispatch({
      type: `${prefix}_PREVIEW_ATTACHMENT_START`
    });
    let name;
    let data;
    let type = attachmentData.get('type');
    if (attachmentData.get('file')) {
      data = attachmentData.get('file');
      name = attachmentData.get('name');
    } else {
      let currentDocumentId = state.updateDocument.getIn([
        'documentToUpdate',
        '_id'
      ]);
      let response;
      try {
        response = await requestor.get(
          `${
            config.server
          }/document/${currentDocumentId}/attachment/${attachmentIndex}`
        );
      } catch (error) {
        return dispatch({
          type: `${prefix}_PREVIEW_ATTACHMENT_FAIL`,
          payload: {
            error: `Unable to preview ${name}.`
          }
        });
      }
      data = response.body;
      name = attachmentData
        .get('name')
        .replace(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/,
          ''
        );
    }
    return dispatch({
      type: `${prefix}_PREVIEW_ATTACHMENT_SUCCESS`,
      payload: {
        name,
        data,
        type
      }
    });
  };
};

export const clearDownload = id => {
  return {
    type: 'ATTACHMENT_DOWNLOAD_CLEAR',
    payload: {
      id
    }
  };
};

export const closeDownloadPane = () => {
  return {
    type: 'ATTACHMENT_DOWNLOAD_CLOSE_PANE'
  };
};
export const clearAllDownloads = () => {
  return {
    type: 'ATTACHMENT_DOWNLOAD_CLEAR_ALL'
  };
};

export const downloadAttachment = (attachmentData, attachmentIndex) => {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.download
      .get('downloads')
      .find(e => e.get('attachmentIndex') === attachmentIndex);
    let currentDocument = state.updateDocument.getIn([
      'documentToUpdate',
      '_id'
    ]);
    if (download) {
      if (download.get('downloading')) {
        return dispatch({
          type: 'ATTACHMENT_DOWNLOAD_ALREADY_DOWNLOADING',
          payload: {
            id: download.get('id'),
            name: download.get('name'),
            attachmentIndex
          }
        });
      } else {
        dispatch({
          type: 'ATTACHMENT_DOWNLOAD_CLEAR',
          payload: {
            id: download.get('id'),
            name: download.get('name'),
            attachmentIndex
          }
        });
      }
    }
    let response;
    let name;
    let data;
    let downloadId = uuid();
    if (attachmentData.get('file')) {
      data = window.Buffer.from(attachmentData.get('file'), 'base64');
      name = attachmentData.get('name');
    } else {
      dispatch({
        type: 'ATTACHMENT_DOWNLOAD_STARTED',
        payload: {
          id: downloadId,
          name: attachmentData.get('name'),
          attachmentIndex
        }
      });
      try {
        response = await requestor.get(
          `${
            config.server
          }/document/${currentDocument}/attachment/${attachmentIndex}`,
          {
            onDataReceived: ({ loaded, total }) => {
              let progress = Math.ceil((loaded / total) * 100);
              dispatch({
                type: 'ATTACHMENT_DOWNLOAD_PROGRESS',
                payload: {
                  id: downloadId,
                  name: attachmentData.get('name'),
                  attachmentIndex,
                  progress
                }
              });
            }
          }
        );
      } catch (error) {
        return dispatch({
          type: 'ATTACHMENT_DOWNLOAD_FAILED',
          payload: {
            id: downloadId,
            name: name,
            attachmentIndex,
            error
          }
        });
      }
      data = window.Buffer.from(response.body, 'base64');
      name = attachmentData
        .get('name')
        .replace(
          /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/,
          ''
        );
    }

    try {
      name = await attachmentUtils.calculateName(
        globalUtils.getAppGlobals('downloadDirectory'),
        name
      );
    } catch (error) {
      return dispatch({
        type: 'ATTACHMENT_DOWNLOAD_FAILED',
        payload: {
          id: downloadId,
          name: name,
          attachmentIndex,
          error
        }
      });
    }

    let downloadPath = path.resolve(
      globalUtils.getAppGlobals('downloadDirectory'),
      name
    );
    fs.writeFile(downloadPath, data, err => {
      if (err) {
        return dispatch({
          type: 'ATTACHMENT_DOWNLOAD_FAILED',
          payload: {
            id: downloadId,
            name: name,
            attachmentIndex
          }
        });
      }
      dispatch({
        type: 'ATTACHMENT_DOWNLOAD_DONE',
        payload: {
          id: downloadId,
          name: name,
          path: downloadPath,
          attachmentIndex
        }
      });
    });
  };
};

export const showInDirectory = path => {
  return dispatch => {
    dispatch({
      type: 'ATTACHMENT_OPEN_START'
    });
    let successfullyOpened = shell.showItemInFolder(path);
    if (successfullyOpened) {
      dispatch({
        type: 'ATTACHMENT_OPEN_DONE'
      });
    } else {
      dispatch({
        type: 'ATTACHMENT_OPEN_ERROR'
      });
    }
  };
};

export default {
  addAttachment,
  removeAttachment,
  previewAttachment,
  downloadAttachment,
  clearDownload,
  clearAllDownloads,
  closeDownloadPane,
  showInDirectory
};
