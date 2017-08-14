const {connect} = require('react-redux');
const Header = require('components/user/Header');
const action = require('actions');

const mapStateToProps = state => {
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

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

module.exports = HeaderContainer;
