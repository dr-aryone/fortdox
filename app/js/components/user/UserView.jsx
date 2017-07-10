const React = require('react');
const SideNavContainer = require('containers/user/SideNavContainer');
const views = require('views.json');
const UserViewFrontPage = require('./UserViewFrontPage');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const UpdateDocContainer = require('containers/document/UpdateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');
//const Header = require('components/user/Header');

const UserView = ({currentView, changeView}) => {
  let page;
  switch (currentView) {
    case views.USER_VIEW:
      page = <UserViewFrontPage changeView={changeView} />;
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
