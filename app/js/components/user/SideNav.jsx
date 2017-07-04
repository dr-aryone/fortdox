const React = require('react');
const SideNavItem = require('./SideNavItem');
const views = require('views.json');

const SideNav = ({onClick}) => {
  return (
    <div className='side-nav'>
      <SideNavItem text='Search' onClick={() => onClick(views.SEARCH_VIEW)} />
      <SideNavItem text='Create Document' onClick={() => onClick(views.CREATE_DOC_VIEW)} />
    </div>
  );
};

module.exports = SideNav;
