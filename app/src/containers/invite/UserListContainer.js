const { connect } = require('react-redux');
const UserList = require('components/invite/UserList');
const { list } = require('actions/organization');

const mapStateToProps = state => {
  return {
    user: state.user.get('email'),
    users: state.invite.get('users')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onMount: () => {
      dispatch(list());
    }
  };
};

const UserListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserList);

module.exports = UserListContainer;
