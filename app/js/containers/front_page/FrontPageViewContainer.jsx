const {connect} = require('react-redux');
const FrontPageView = require('components/front_page/FrontPageView');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    splashScreen: state.navigation.get('splashScreen')
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
