const {getPrefix} = require('./utilities');
const fs = window.require('fs');
const attachmentUtils = require('../utilities/attachments');
const globalUtils = require('../utilities/global');
const path = require('path');
const uuid = require('uuid');
const {shell} = window.require('electron');

const FILE_MAX_SIZE = 30 * 1000 * 1000;

const addAttachment = files => {
  return async (dispatch, getState) => {
    let state = getState();
    let {prefix} = getPrefix(state.navigation.get('currentView'));
    for (let file of Array.from(files)) {
      if (file.size > FILE_MAX_SIZE) {
        dispatch({
          type: `${prefix}_ADD_ATTACHMENT_ERROR`,
          payload: {
            error: 'attachmentTooLarge',
            file
          }
        });
        continue;
      }
      try {
        let data = await attachmentUtils.readSource(file);
        dispatch({
          type: `${prefix}_ADD_ATTACHMENT`,
          fileType: file.type,
          name: file.name,
          file: data.toString('base64')
        });
      } catch (error) {
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

const removeAttachment = id => {
  return async(dispatch, getState) => {
    let state = getState();
    let {view, prefix} = getPrefix(state.navigation.get('currentView'));
    let attachments = state[view].getIn(['docFields', 'attachments']);
    attachments = attachments.splice(id, 1);
    return dispatch({
      type: `${prefix}_REMOVE_ATTACHMENT`,
      payload: attachments
    });
  };
};

const clearDownload = id => {
  return {
    type: 'ATTACHMENT_DOWNLOAD_CLEAR',
    payload: {
      id
    }
  };
};

const clearAllDownloads = () => {
  return {
    type: 'ATTACHMENT_DOWNLOAD_CLEAR_ALL'
  };
};


const downloadAttachment = (attachmentData, attachmentIndex) => {
  return async (dispatch, getState) => {
    let state = getState();
    let download = state.download.get('downloads').find(e => e.get('attachmentIndex') === attachmentIndex);
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
    let downloadId = uuid();
    dispatch({
      type: 'ATTACHMENT_DOWNLOAD_STARTED',
      payload: {
        id: downloadId,
        name: attachmentData.get('name'),
        attachmentIndex
      }
    });
    if (attachmentData.get('file')) {
      let data = window.Buffer.from(attachmentData.get('file'), 'base64');
      let name;
      try {
        name = await attachmentUtils.calculateName(globalUtils.getAppGlobals('downloadDirectory'), attachmentData.get('name'));
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

      let downloadPath = path.resolve(globalUtils.getAppGlobals('downloadDirectory'), name);
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
    } else {
      //Attachment data was not sent when fetching document
    }
  };
};

const showInDirectory = path => {
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

module.exports = {
  addAttachment,
  removeAttachment,
  downloadAttachment,
  clearDownload,
  clearAllDownloads,
  showInDirectory
};
