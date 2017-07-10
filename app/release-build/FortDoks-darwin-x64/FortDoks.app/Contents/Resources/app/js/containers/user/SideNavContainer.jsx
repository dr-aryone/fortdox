const {connect} = require('react-redux');
const SideNav = require('components/user/SideNav');
const action = require('actions');

const mapStateToProps = (state) => {
  return {
    username: state.user.get('username'),
    organization: state.user.get('organization')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeView: (nextView) => {
      dispatch(action.changeView(nextView));
    },
    logout: () => {
      dispatch(action.logout());
    }
  };
};

const SideNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNav);

module.exports = SideNavContainer;
