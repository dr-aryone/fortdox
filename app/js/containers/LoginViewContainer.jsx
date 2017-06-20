const {connect} = require('react-redux');
const LoginView = require('components/LoginView');
const action = require('actions');

const mapStateToProps = state => {
  return {
    input: {
      userInputValue: state.login.get('userInputValue'),
      passwordInputValue: state.login.get('passwordInputValue'),
      error: state.login.get('error')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange('login_view', event.target.name, event.target.value));
    },
    onLogin: (event) => {
      event.preventDefault();
      dispatch(action.login(event.target.name, event.target.value));

    },
    onRegister: () => {
      dispatch(action.changeView('register'));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
