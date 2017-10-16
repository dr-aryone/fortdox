const getPrefix = currentView => {
  let view;
  let prefix;
  switch (currentView) {
    case 'UPDATE_DOC_VIEW':
      view = 'updateDocument';
      prefix = 'UPDATE_DOC';
      return {view, prefix};
    case 'CREATE_DOC_VIEW':
      view = 'createDocument';
      prefix = 'CREATE_DOC';
      return {view, prefix};
    case 'SEARCH_VIEW':
    case 'PREVIEW_DOC':
      view = 'previewDocument';
      prefix= 'PREVIEW_DOC';
      return {view, prefix};
  }
};

module.exports = {
  getPrefix
};
