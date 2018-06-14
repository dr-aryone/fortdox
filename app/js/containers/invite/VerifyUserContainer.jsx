const { connect } = require('react-redux');
const InviteView = require('components/invite/InviteView');
const action = require('actions');
const { verifyUser, receivePrivateKey } = require('actions/invite');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    fields: state.verifyUser.get('fields'),
    isLoading: state.verifyUser.get('isLoading'),
    privateKey: state.verifyUser.get('privateKey'),
    error: state.verifyUser.get('error'),
    uuid: state.verifyUser.get('uuid'),
    temporaryPassword: state.verifyUser.get('temporaryPassword')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(receivePrivateKey());
    },
    onChange: event => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSubmit: event => {
      event.preventDefault();
      dispatch(verifyUser());
    },
    onVerifyUser: event => {
      event.preventDefault();
      dispatch(receivePrivateKey());
    },
    toVerifyInvite: () => {
      dispatch(action.changeView('VERIFY_INVITE_VIEW'));
    },
    toLoginView: () => {
      dispatch(action.changeView('LOGIN_VIEW'));
    }
  };
};

const VerifyUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteView);

module.exports = VerifyUserContainer;
