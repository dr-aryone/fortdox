const { connect } = require('react-redux');
const LoginView = require('components/front_page/login/LoginView');
const action = require('actions');
const { loginAs } = require('actions/login');
const { directLogin } = require('actions/login');

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
      dispatch(directLogin());
    },
    loginAs: (email, organization, event) => {
      event.preventDefault();
      dispatch(loginAs(email, organization));
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

module.exports = LoginViewContainer;
