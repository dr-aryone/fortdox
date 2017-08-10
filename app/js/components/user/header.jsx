const React = require('react');

const Header = ({organization, changeView})=> {
  return (
    <div className='header'>
      <div className='container'>
        <span>
          <i className='material-icons nav-icons' onClick={() => changeView('SEARCH_VIEW')}>search</i>
          <i className='material-icons nav-icons' onClick={() => changeView('CREATE_DOC_VIEW')}>description</i>
          <i className='material-icons nav-icons' onClick={() => changeView('INVITE_USER_VIEW')}>person_add</i>
        </span>
        <span>
          <span className='organization'>{organization}</span>
          <span>
            <i className='material-icons account-icons'>account_circle</i>
            <i className='material-icons account-icons'>keyboard_arrow_down</i>
          </span>
        </span>
      </div>
    </div>
  );
};

module.exports = Header;
