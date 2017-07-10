const React = require('react');
const views = require('views.json');

const UserViewFrontPage = ({changeView}) => {
  return (
    <div className='container-fluid vertical-middle'>
      <div className='col-sm-10 col-sm-offset-1'>
        <div className='list'>
          <div className='list-inner' onClick={() => changeView(views.CREATE_DOC_VIEW)}>
            <div>
              <i className='material-icons'>description</i>
              <h2>Create Document</h2>
            </div>
          </div>
          <div className='list-inner' onClick={() => changeView(views.SEARCH_VIEW)}>
            <div>
              <i className='material-icons'>search</i>
              <h2>Search</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = UserViewFrontPage;
