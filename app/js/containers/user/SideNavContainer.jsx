const {connect} = require('react-redux');
const SideNav = require('components/user/SideNav');
const action = require('actions');

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    changeView: (nextView) => {
      console.log(nextView);
      dispatch(action.changeView(nextView));
    }
  };
};

const SideNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNav);

module.exports = SideNavContainer;
