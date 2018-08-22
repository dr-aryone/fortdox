const { fromJS, List, Map } = require('immutable');

const initialState = fromJS({
  downloads: [],
  show: false
});

const download = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
    case 'SESSION_EXPIRED':
      return initialState;
    case 'ATTACHMENT_DOWNLOAD_CLOSE_PANE': {
      return state.set('show', false);
    }
    case 'ATTACHMENT_DOWNLOAD_STARTED': {
      return state
        .update('downloads', list =>
          list.push(
            Map({
              id: action.payload.id,
              name: action.payload.name,
              path: action.payload.path,
              downloadListIndex: action.payload.downloadListIndex,
              downloading: true,
              progress: 0
            })
          )
        )
        .set('show', true);
    }
    case 'ATTACHMENT_DOWNLOAD_PROGRESS': {
      let downloadListIndex = state
        .get('downloads')
        .findIndex(e => e.get('id') === action.payload.id);
      let updatedDownload = Map({
        id: action.payload.id,
        name: action.payload.name,
        attachmentIndex: action.payload.attachmentIndex,
        downloading: true,
        progress: action.payload.progress
      });
      if (downloadListIndex !== -1) {
        return state.updateIn(
          ['downloads', downloadListIndex],
          () => updatedDownload
        );
      }
      return state.update('downloads', list => list.push(updatedDownload));
    }
    case 'ATTACHMENT_DOWNLOAD_DONE': {
      let downloadListIndex = state
        .get('downloads')
        .findIndex(e => e.get('id') === action.payload.id);
      let updatedDownload = Map({
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        attachmentIndex: action.payload.attachmentIndex,
        downloading: false,
        progress: 100
      });
      if (downloadListIndex !== -1) {
        return state.updateIn(
          ['downloads', downloadListIndex],
          () => updatedDownload
        );
      }
      return state
        .update('downloads', list => list.push(updatedDownload))
        .set('show', true);
    }
    case 'ATTACHMENT_DOWNLOAD_CLEAR': {
      let downloadListIndex = state
        .get('downloads')
        .findIndex(e => e.get('id') === action.payload.id);
      if (downloadListIndex !== -1) {
        return state.update('downloads', list =>
          list.splice(downloadListIndex, 1)
        );
      }
      return state;
    }
    case 'ATTACHMENT_DOWNLOAD_CLEAR_ALL': {
      return state.set('downloads', List());
    }
    case 'ATTACHMENT_DOWNLOAD_ERROR': {
      let downloadListIndex = state
        .get('downloads')
        .findIndex(e => e.get('id') === action.payload.id);
      let updatedDownload = Map({
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        attachmentIndex: action.payload.downloadListIndex,
        downloading: false,
        error: true
      });
      if (downloadListIndex !== -1) {
        return state.updateIn(
          ['downloads', downloadListIndex],
          () => updatedDownload
        );
      }
      return state.update('downloads', list => list.push(updatedDownload));
    }
    case 'TOGGLE_VERSION_HISTORY':
      return state.set('show', false);
    default: {
      return state;
    }
  }
};

module.exports = download;
