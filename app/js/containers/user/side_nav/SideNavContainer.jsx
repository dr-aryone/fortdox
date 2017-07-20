const {connect} = require('react-redux');
const SideNav = require('components/user/side_nav/SideNav');
const action = require('actions');

const mapStateToProps = (state) => {
  return {
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
