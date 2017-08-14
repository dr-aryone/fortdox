const {getPrefix} = require('./utilities');

const addAttachment = files => {
  return async (dispatch, getState) => {
    let state = getState();
    let {prefix} = getPrefix(state.navigation.get('currentView'));
    for (let file of Array.from(files)) {
      (async (file) =>  {
        let reader = new FileReader();
        reader.onload = e => {
          dispatch({
            type: `${prefix}_ADD_ATTACHMENT`,
            fileType: file.type,
            name: file.name,
            file: e.target.result.split(',')[1]
          });
        };
        reader.readAsDataURL(file);
      })(file);
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

module.exports = {
  addAttachment,
  removeAttachment
};
