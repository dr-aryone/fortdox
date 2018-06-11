const React = require('react');
const SideNavItem = require('./SideNavItem');

const SideNav = ({changeView, organization, email, logout}) => {
  return (
    <div className='side-bar'>
      <div className='user-panel'>
        <i className='material-icons'>account_circle</i>
        <h2>{organization}</h2>
        <h3>{email}</h3>
      </div>
      <ul className='side-nav'>
        <SideNavItem text='Search' icon='search' onClick={() => changeView('SEARCH_VIEW')} />
        <SideNavItem text='Create Document' icon='description' onClick={() => changeView('CREATE_DOC_VIEW')} />
        <SideNavItem text='Invite User' icon='person_add' onClick={() => changeView('INVITE_USER_VIEW')} />
      </ul>
      <div className='logout-panel'>
        <a onClick={logout}>
          <i className='material-icons nav-icon'>power_settings_new</i>
          Logout
        </a>
      </div>
    </div>
  );
};

module.exports = SideNav;
