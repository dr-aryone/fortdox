const {fromJS} = require('immutable');

const initialState = fromJS({
  show: false,
  text: '',
  icon: ''
});

const toast = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_TOAST':
      return state.set('show', true)
        .set('text', action.payload.text)
        .set('icon', action.payload.icon);
    case 'HIDE_TOAST':
      return state.set('show', false);
    default:
      return state;
  }
};

module.exports = toast;
