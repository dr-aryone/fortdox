import loginActions from 'actions/login';
import { connect } from 'react-redux';
import LoginView from 'components/front_page/login/LoginView';
import action from 'actions';

const mapStateToProps = state => {
  return {
    message: state.login.get('message'),
    warning: state.login.get('warning'),
    modalLoader: state.login.get('modalLoader')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(loginActions.directLogin());
    },
    loginAs: (email, organization, event) => {
      event.preventDefault();
      dispatch(loginActions.loginAs(email, organization));
    },
    toRegisterView: () => {
      dispatch(action.changeView('REGISTER_VIEW'));
    },
    toVerifyInvite: () => {
      dispatch(action.changeView('INVITE_VIEW'));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginView);

export default LoginViewContainer;
