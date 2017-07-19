const React = require('react');
const SideNavContainer = require('containers/user/side_nav/SideNavContainer');
const UserViewFrontPage = require('./UserViewFrontPage');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
const InviteUserContainer = require('containers/invite/InviteUserContainer');
//const Header = require('components/user/Header');

const UserView = ({currentView, message, changeView}) => {
  let page;
  switch (currentView) {
    case 'USER_VIEW':
      page = <UserViewFrontPage changeView={changeView} message={message} />;
      break;
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
