const React = require('react');
const SideNavContainer = require('containers/user/sideNav/SideNavContainer');
const views = require('views.json');
const UserViewFrontPage = require('./UserViewFrontPage');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
const InviteUserContainer = require('containers/invite/InviteUserContainer');
//const Header = require('components/user/Header');

const UserView = ({currentView, message, changeView}) => {
  let page;
  switch (currentView) {
    case views.USER_VIEW:
      page = <UserViewFrontPage changeView={changeView} message={message} />;
      break;
    case views.SEARCH_VIEW:
      page = <SearchViewContainer />;
      break;
    case views.CREATE_DOC_VIEW:
      page = <CreateDocContainer />;
      break;
    case views.UPDATE_DOC_VIEW:
      page = <UpdateDocContainer />;
      break;
    case views.INVITE_USER_VIEW:
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
