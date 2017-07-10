const {connect} = require('react-redux');
const UserView = require('components/user/UserView');

const mapStateToProps = state => {
  return {
    username: state.login.get('username'),
    currentView: state.navigation.get('currentView')
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
