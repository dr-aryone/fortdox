const {connect} = require('react-redux');
const {inputChange} = require('../actions');
const {login} = require('../actions');
const {changeView} = require('../actions');
const LoginView = require('../components/LoginView');

const mapStateToProps = state => {
  return {
    input: {
      userInputValue: state.login.get('userInputValue'),
      passwordInputValue: state.login.get('passwordInputValue')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(inputChange(event.target.name, event.target.value));
    },
    onClick: (e, username, password) => {
      if (e.target.name === 'login') {
        e.preventDefault();
        dispatch(login(username, password));
      } else if (e.target.name === 'register') {
        dispatch(changeView('register'));
      }
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
