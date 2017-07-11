const {connect} = require('react-redux');
const RegisterView = require('components/front_page/register/RegisterView');
const action = require('actions');
const register = require('actions/register');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    register: {
      organizationInputValue: state.register.get('organizationInputValue'),
      usernameInputValue: state.register.get('usernameInputValue'),
      emailInputValue: state.register.get('emailInputValue'),
      passwordInputValue: state.register.get('passwordInputValue'),
      retypedPasswordInputValue: state.register.get('retypedPasswordInputValue'),
      errorMsg: state.register.get('errorMsg'),
      orgNameError: state.register.get('orgNameError'),
      activateError: state.register.get('activateError'),
      isLoading: state.register.get('isLoading'),
      isVerified: state.register.get('isVerified')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(register.verifyActivationCode());
    },
    onChange: (e) => {
      dispatch(action.inputChange(e.target.name, e.target.value));
    },
    onCreateOrganization: () => {
      dispatch(register.registerOrganization());
    },
    onRegister: () => {
      dispatch(register.activateOrganizaton());
    },
    toLoginView: () => {
      dispatch(action.currentViewToDefault());
      dispatch(action.changeView(views.LOGIN_VIEW));
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
