import UserView from 'components/user/UserView';
const { connect } = require('react-redux');
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

export default UserViewContainer;
