const {connect} = require('react-redux');
const RegisterView = require('components/front_page/register/RegisterView');
const action = require('actions');
const register = require('actions/register');
const views = require('views.json');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    register: {
      organisationInputValue: state.register.get('organisationInputValue'),
      usernameInputValue: state.register.get('usernameInputValue'),
      passwordInputValue: state.register.get('passwordInputValue'),
      reTypedPassword: state.register.get('reTypedPasswordInputValue'),
      errorMsg: state.register.get('errorMsg'),
      teamNameError: state.register.get('teamNameError'),
      verifyError: state.register.get('verifyError')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (e) => {
      dispatch(action.inputChange(e.target.name, e.target.value));
    },
    onVerify: () => {
      dispatch(register.registerTeamName());
    },
    onRegister: () => {
      dispatch(register());
    },
    toLoginView: () => {
      dispatch(action.changeView(views.LOGIN_VIEW));
      dispatch(action.currentViewToDefault());
    },
    toRegisterView: () => {
      dispatch(action.changeView(views.REGISTER_TEAM_VIEW));
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
