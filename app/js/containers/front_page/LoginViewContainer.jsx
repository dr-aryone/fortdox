const {connect} = require('react-redux');
const LoginView = require('components/front_page/login/LoginView');
const action = require('actions');
const login = require('actions/login');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    input: {
      emailInputValue: state.login.get('emailInputValue'),
      passwordInputValue: state.login.get('passwordInputValue'),
      error: state.login.get('error'),
      errorMsg: state.login.get('errorMsg')
    },
    isLoading: state.login.get('isLoading'),
    message: state.login.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onLogin: (event) => {
      event.preventDefault();
      dispatch(login());
    },
    toUserView: () => {
      dispatch(action.changeView(views.USER_VIEW));
    },
    toRegisterView: () => {
      dispatch(action.changeView(views.REGISTER_VIEW));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

module.exports = LoginViewContainer;
