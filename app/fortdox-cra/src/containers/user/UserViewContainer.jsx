const { connect } = require('react-redux');
const UserView = require('components/user/UserView');
const action = require('actions');
const attachmentActions = require('actions/document/attachments');

const mapStateToProps = state => {
  return {
    currentView: state.navigation.get('currentView'),
    downloads: state.download.get('downloads')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeView: nextView => {
      dispatch(action.changeView(nextView));
    },
    onOpenAttachment: path => {
      dispatch(attachmentActions.showInDirectory(path));
    },
    onClearDownload: id => {
      dispatch(attachmentActions.clearDownload(id));
    },
    onClearAllDownloads: () => {
      dispatch(attachmentActions.clearAllDownloads());
    }
  };
};

const UserViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserView);

module.exports = UserViewContainer;
