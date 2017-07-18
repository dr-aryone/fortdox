const React = require('react');
const fs = window.require('fs');

const LoginView = ({loginAs, toRegisterView, toUserView, message}) => {
  let storage;
  let userList = [];
  let storagePath = window.__dirname + '/local_storage.json';
  if (fs.existsSync(storagePath)) {
    storage = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
    Object.entries(storage).forEach(([email, value]) => {
      Object.keys(value).forEach((organization) => {
        userList.push(
          <div onClick={() => loginAs(email, organization)} key={email+organization}>
            <h2>{organization}</h2>
            <h3>{email}</h3>
          </div>
        );
      });
    });
  }
  let messageBox = (
    <div className='alert alert-success'>
      <i className='material-icons'>
        check
      </i>
      {message}
    </div>
  );
  return (
    <div className='container'>
      {message ? messageBox : null}
      <h1 className='text-center'>FortDox</h1>
      <div className={`box login-panel ${userList.length == 0 ? 'hide' :''}`}>
        <h2>{userList.length > 0 ? 'Choose an account': null}</h2>
        {userList}
      </div>
      <a onClick={toRegisterView} className='btn btn-block'>
          Register a New Team
      </a>
      <a onClick={toUserView} className='btn btn-block'>
        Fusk knapp!
      </a>
    </div>
  );
};

module.exports = LoginView;
