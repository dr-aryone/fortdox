const {connect} = require('react-redux');
const UserView = require('components/user/UserView');
const action = require('actions');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    message: state.userPage.get('message')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeView: (nextView) => {
      dispatch(action.changeView(nextView));
    }
  };
};

const UserViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserView);

module.exports = UserViewContainer;
