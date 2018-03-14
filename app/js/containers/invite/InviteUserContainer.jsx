const {connect} = require('react-redux');
const InviteUserView = require('components/invite/InviteUserView');
const action = require('actions');
const {inviteUser, deleteUser} = require('actions/invite');

const mapStateToProps = state => {
  return {
    fields: state.invite.get('fields'),
    isLoading: state.invite.get('isLoading'),
    message: state.invite.get('message'),
    error: state.invite.get('error')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (event) => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onSend: (event) => {
      event.preventDefault();
      dispatch(inviteUser());
    },
    onDeleteUser: email => {
      dispatch(deleteUser(email));
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteUserView);

module.exports = LoginViewContainer;
