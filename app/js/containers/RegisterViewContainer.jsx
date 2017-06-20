const {connect} = require('react-redux');
const RegisterView = require('../components/RegisterView');
const {inputChange} = require('../actions');
const {clearFields} = require('../actions');
const {registerUser} = require('../actions');

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
      dispatch(inputChange('register_view', e.target.name, e.target.value));
    },
    onClick: (e, username, password, reTypedPassword) => {
      if (password.localeCompare(reTypedPassword) === 0) {
        dispatch(registerUser(username, password));
      } else {
        dispatch(clearFields('register_view'));
      }
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
