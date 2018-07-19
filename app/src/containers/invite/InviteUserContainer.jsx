import { inviteUser, deleteUser } from 'actions/invite';
const { connect } = require('react-redux');
const InviteUserView = require('components/invite/InviteUserView');
const action = require('../../actions');
const { list } = require('actions/organization');

const mapStateToProps = state => {
  return {
    fields: state.invite.get('fields'),
    isLoading: state.invite.get('isLoading'),
    message: state.invite.get('message'),
    error: state.invite.get('error'),
    refresh: state.invite.get('refresh')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: event => {
      dispatch(action.inputChange(event.target.name, event.target.value));
    },
    onInvite: async (event, email) => {
      event.preventDefault();
      await dispatch(inviteUser(email));
      dispatch(list());
    },
    onDeleteUser: async email => {
      await dispatch(deleteUser(email));
      dispatch(list());
    }
  };
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InviteUserView);

export default LoginViewContainer;
