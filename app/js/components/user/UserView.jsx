const React = require('react');
const HeaderContainer = require('containers/user/HeaderContainer');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
const InviteUserContainer = require('containers/invite/InviteUserContainer');
const DownloadManager = require('components/general/DownloadManager');
const SplashScreen = require('components/general/SplashScreen');

const UserView = ({
  currentView,
  splashScreen,
  downloads,
  onOpenAttachment,
  onClearDownload,
  onClearAllDownloads
}) => {
  let page;
  switch (currentView) {
    case 'USER_VIEW':
    case 'SEARCH_VIEW':
      page = <SearchViewContainer />;
      break;
    case 'CREATE_DOC_VIEW':
      page = <CreateDocContainer />;
      break;
    case 'UPDATE_DOC_VIEW':
      page = <UpdateDocContainer />;
      break;
    case 'INVITE_USER_VIEW':
      page = <InviteUserContainer />;
      break;
  }

  return (
    <div className='wrapper'>
      <SplashScreen show={splashScreen} />;
      <HeaderContainer />
      {page}
      <DownloadManager
        downloads={downloads}
        onOpenAttachment={onOpenAttachment}
        onClearDownload={onClearDownload}
        onClearAll={onClearAllDownloads}
      />
    </div>
  );
};

module.exports = UserView;
