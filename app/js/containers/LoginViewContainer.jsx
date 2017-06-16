const {connect} = require('react-redux');
const {inputChange} = require('../actions');
const LoginView = require('../components/LoginView');

const mapStateToProps = state => {
  return {
    input: {
      userInputValue: state.login.userInputValue,
      passwordInputValue: state.login.passwordInputValue
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(inputChange(event.target.name, event.target.value));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
