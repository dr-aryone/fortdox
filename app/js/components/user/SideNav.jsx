const React = require('react');
const SideNavItem = require('./SideNavItem');
const views = require('views.json');

const SideNav = ({changeView}) => {
  return (
    <div className='side-bar'>
      <ul className='side-nav'>
        <SideNavItem text='Bleh'>
          <li>Bra jobbat Lili</li>
        </SideNavItem>
        <SideNavItem text='Något'>
          <li onClick={() => changeView(views.CREATE_DOC_VIEW)}>Bra jobbat Lili</li>
        </SideNavItem>
        <li onClick={() => changeView(views.SEARCH_VIEW)}>Search</li>
      </ul>
    </div>
  );
};

module.exports = SideNav;
