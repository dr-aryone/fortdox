const {connect} = require('react-redux');
const UserView = require('components/UserView');

const mapStateToProps = state => {
  return {
    username: state.login.get('username')
  };
};

const mapDispatchToProps = () => {
  return {};
};

const UserViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserView);

module.exports = UserViewContainer;
