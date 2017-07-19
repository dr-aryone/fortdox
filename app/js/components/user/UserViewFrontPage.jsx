const React = require('react');

const UserViewFrontPage = ({changeView, message}) => {
  let messageBox = message ? (
    <div className='alert alert-success'>
      <i className='material-icons'>check</i>
      {message}
    </div>
  ) : null;
  return (
    <div className='container-fluid center-middle'>
      {messageBox}
      <div className='list'>
        <div className='list-inner' onClick={() => changeView('CREATE_DOC_VIEW')}>
          <div>
            <i className='material-icons'>description</i>
            <h2>Create Document</h2>
          </div>
        </div>
        <div className='list-inner' onClick={() => changeView('SEARCH_VIEW')}>
          <div>
            <i className='material-icons'>search</i>
            <h2>Search</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = UserViewFrontPage;
