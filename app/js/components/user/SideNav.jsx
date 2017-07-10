const React = require('react');
const SideNavItem = require('./SideNavItem');
const views = require('views.json');

const SideNav = ({changeView, username, organization, logout}) => {
  return (
    <div className='side-bar'>
      <div className='user-panel'>
        <i className='material-icons'>account_circle</i>
        <h2>{organization}</h2>
        <h3>{username}</h3>
      </div>
      <ul className='side-nav'>
        <SideNavItem text='Users' icon='person' />
        <SideNavItem text='Search' icon='search' onClick={() => changeView(views.SEARCH_VIEW)} />
        <SideNavItem text='Create Document' icon='description' onClick={() => changeView(views.CREATE_DOC_VIEW)} />
        <SideNavItem text='Passwords' icon='lock' />
        <SideNavItem text='Test Dropdown' icon='mail'>
          <li>Test</li>
          <li>Test</li>
        </SideNavItem>
        <SideNavItem text='Passwords' icon='lock' />
        <SideNavItem text='Passwords' icon='lock' />
        <SideNavItem text='Passwords' icon='lock' />
        <SideNavItem text='Passwords' icon='lock' />
        <SideNavItem text='Passwords' icon='lock' />
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
