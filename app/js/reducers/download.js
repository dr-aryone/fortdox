const {fromJS, List, Map} = require('immutable');

const initialState = fromJS({
  downloads: []
});

const download = (state = initialState, action) => {
  switch (action.type) {
    case 'ATTACHMENT_DOWNLOAD_STARTED': {
      return state.update('downloads', list => list.push(Map({
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        index: action.payload.index,
        downloading: true,
        progress: 0
      })));
    } case 'ATTACHMENT_DOWNLOAD_DONE': {
      return state.updateIn(['downloads', action.payload.index], () => Map({
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        index: action.payload.index,
        downloading: false,
        progress: 100
      }));
    } case 'ATTACHMENT_DOWNLOAD_CLEAR': {
      return state.update('downloads', list => list.splice(action.payload.index, 1));
    } case 'ATTACHMENT_DOWNLOAD_CLEAR_ALL': {
      return state.set('downloads', List());
    } case 'ATTACHMENT_DOWNLOAD_ERROR': {
      return state.updateIn(['downloads', action.payload.index], () => Map({
        id: action.payload.id,
        name: action.payload.name,
        path: action.payload.path,
        index: action.payload.index,
        downloading: false,
        error: true
      }));
    } default: {
      return state;
    }
  }
};

module.exports = download;
