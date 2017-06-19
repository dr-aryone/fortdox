const {fromJS} = require('immutable');

const initialState = fromJS({
  username: '',
  password: '',
  reTypedPassword: ''
});

const register = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

module.exports = register;
