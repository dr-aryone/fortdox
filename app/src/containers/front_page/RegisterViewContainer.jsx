import {
  registerOrganization,
  verifyActivationCode,
  activateOrganizaton
} from 'actions/register';
import RegisterView from 'components/front_page/register/RegisterView';
import { connect } from 'react-redux';
import action from 'actions';

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    registerFields: state.register.get('registerFields'),
    activateFields: state.register.get('activateFields'),
    activationCode: state.register.get('activationCode'),
    message: state.register.get('message'),
    isVerified: state.register.get('isVerified'),
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
    onVerifyCode: event => {
      event.preventDefault();
      dispatch(verifyActivationCode());
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
