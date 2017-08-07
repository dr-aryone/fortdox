const React = require('react');
const SideNavContainer = require('containers/user/side_nav/SideNavContainer');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
const InviteUserContainer = require('containers/invite/InviteUserContainer');

const UserView = ({currentView}) => {
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
      <SideNavContainer />
      {/* <Header /> */}
      {page}
    </div>
  );
};

module.exports = UserView;
