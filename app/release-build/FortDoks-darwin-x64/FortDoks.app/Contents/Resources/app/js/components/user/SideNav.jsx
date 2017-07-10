const React = require('react');
const SideNavItem = require('./SideNavItem');
const views = require('views.json');

const SideNav = ({changeView}) => {
  return (
    <div className='side-bar'>
      <ul className='side-nav'>
        <SideNavItem text='test' icon='search'>
          <li>Test</li>
          <li>Test</li>
        </SideNavItem>
        <SideNavItem text='Search' icon='search' onClick={() => changeView(views.SEARCH_VIEW)} />
        <SideNavItem text='Create Document' icon='description' onClick={() => changeView(views.CREATE_DOC_VIEW)} />
      </ul>
    </div>
  );
};

module.exports = SideNav;
