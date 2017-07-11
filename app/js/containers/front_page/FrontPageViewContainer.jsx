const {connect} = require('react-redux');
const FrontPageView = require('components/front_page/FrontPageView');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView')
  };
};

const mapDispatchToProps = () => {
  return {};
};

const LoginViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontPageView);

module.exports = LoginViewContainer;
