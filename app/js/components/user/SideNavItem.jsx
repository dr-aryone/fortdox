const React = require('react');

const SideNavItem = ({text, onClick}) => {
  return (
    <div className='side-nav-item' onClick={onClick}>
      {text}
    </div>
  );
};

module.exports = SideNavItem;
