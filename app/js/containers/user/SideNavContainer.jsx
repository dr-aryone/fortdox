const {connect} = require('react-redux');
const SideNav = require('components/user/SideNav');
const action = require('actions');

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    onClick: (event, nextView) => {
      toggle(event);
      dispatch(action.changeView(nextView));
    }
  };
};

function toggle (event) {
  console.log(event);
}

const SideNavContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideNav);

module.exports = SideNavContainer;
