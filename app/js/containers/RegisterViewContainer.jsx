const {connect} = require('react-redux');
const RegisterView = require('../components/RegisterView');
const action = require('action');

const mapStateToProps = state => {
  return {
    register: {
      username: state.register.get('username'),
      password: state.register.get('password'),
      reTypedPassword: state.register.get('reTypedPassword'),
      error: state.register.get('error')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (e) => {
      dispatch(action.inputChange('register_view', e.target.name, e.target.value));
    },
    onClick: (e, username, password, reTypedPassword) => {
      if (password.localeCompare(reTypedPassword) === 0) {
        dispatch(action.registerUser(username, password));
      } else {
        dispatch(action.clearFields('register_view'));
      }
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
