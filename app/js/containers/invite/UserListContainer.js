const {connect} = require('react-redux');
const UserList = require('components/invite/UserList');
const {list} = require('actions/organization');

const mapStateToProps = state => {
  return {
    users: state.organization.get('users'),
    loading: state.organization.get('loading'),
    error: state.organization.get('error')
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
