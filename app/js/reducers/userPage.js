const {fromJS} = require('immutable');

const initialState = fromJS({
  message: null
});

const userPage = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_DOCUMENT_SUCCESS':
    case 'UPDATE_DOCUMENT_SUCCESS':
      return state.set('message', fromJS(action.payload));
    case 'CHANGE_VIEW':
      return initialState;
    default:
      return state;
  }
};

module.exports = userPage;
