const {connect} = require('react-redux');
const RegisterView = require('components/front_page/register/RegisterView');
const action = require('actions');
const register = require('actions/register');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    registerFields: state.register.get('registerFields'),
    activateFields: state.register.get('activateFields'),
    register: {
      verifyCodeError: state.register.get('verifyCodeError'),
      isLoading: false,
      registerError: state.register.get('registerError'),
      activateOrgError: state.register.get('activateOrgError')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(register.verifyActivationCode());
    },
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onCreateOrganization: (event) => {
      event.preventDefault();
      dispatch(register.registerOrganization());
    },
    onRegister: (event) => {
      event.preventDefault();
      dispatch(register.activateOrganizaton());
    },
    toLoginView: () => {
      dispatch(action.changeView('LOGIN_VIEW'));
    }
  };
};

const RegisterViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterView);

module.exports = RegisterViewContainer;
