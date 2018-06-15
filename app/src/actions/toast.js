module.exports = {
  show
};

function show({ text, icon, timeout }) {
  return dispatch => {
    dispatch({
      type: 'SHOW_TOAST',
      payload: {
        text,
        icon
      }
    });

    setTimeout(() => {
      dispatch({
        type: 'HIDE_TOAST'
      });
    }, !isNaN(timeout) ? timeout : 3000);
  };
}
