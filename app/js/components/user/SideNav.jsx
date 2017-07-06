const React = require('react');
const SideNavItem = require('./SideNavItem');
const views = require('views.json');

const SideNav = ({changeView}) => {
  return (
    <div className='side-bar'>
      <ul className='side-nav'>
        <SideNavItem text='Test'>
          <li>Test</li>
          <li>Test</li>
        </SideNavItem>
        <SideNavItem text='Bleh'>
          <li>Banana</li>
          <li>Test</li>
        </SideNavItem>
        <li className='side-nav-item' onClick={() => changeView(views.SEARCH_VIEW)}>
          <a>Search</a>
        </li>
        <li className='side-nav-item' onClick={() => changeView(views.CREATE_DOC_VIEW)}>
          <a>Create Document</a>
        </li>
      </ul>
    </div>
  );
};

module.exports = SideNav;
