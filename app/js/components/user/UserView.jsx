const React = require('react');
const SideNavContainer = require('containers/user/SideNavContainer');
const views = require('views.json');
const UserViewFrontPage = require('./userViewFrontPage');
const CreateDocContainer = require('containers/document/CreateDocContainer');
const SearchViewContainer = require('containers/search/SearchViewContainer');

const UserView = ({currentView, username}) => {
  let page;
  switch (currentView) {
    case views.USER_VIEW:
      page = <UserViewFrontPage username={username} />;
      break;
    case views.SEARCH_VIEW:
      page = <SearchViewContainer />;
      break;
    case views.CREATE_DOC_VIEW:
      page = <CreateDocContainer />;
      break;
  }

  return (
    <div className='wrapper'>
      <SideNavContainer />
      {page}
    </div>
  );
};

module.exports = UserView;
