import {
  registerOrganization,
  verifyActivationCode,
  activateOrganizaton
} from 'actions/register';
const { connect } = require('react-redux');
const RegisterView = require('components/front_page/register/RegisterView');
const action = require('actions');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    registerFields: state.register.get('registerFields'),
    activateFields: state.register.get('activateFields'),
    register: {
      verifyCodeError: state.register.get('verifyCodeError'),
      isLoading: state.register.get('isLoading'),
      registerError: state.register.get('registerError'),
      activateOrgError: state.register.get('activateOrgError')
    }
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(verifyActivationCode());
    },
    onChange: event => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onCreateOrganization: event => {
      event.preventDefault();
      dispatch(registerOrganization());
    },
    onRegister: event => {
      event.preventDefault();
      dispatch(activateOrganizaton());
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

export default RegisterViewContainer;
