const React = require('react');
const {readStorage} = require('actions/utilities/storage');
const config = require('../../../../config.json');

const LoginView = ({loginAs, toRegisterView, toUserView, message}) => {
  let userList = [];
  let storage = readStorage();
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
      <h1 className='text-center'>{config.name}</h1>
      <div className={`box login-panel ${userList.length == 0 ? 'hide' :''}`}>
        <h2>{userList.length > 0 ? 'Choose an account': null}</h2>
        {userList}
      </div>
      <button onClick={toRegisterView} className='block'>
          Register a New Team
      </button>
      <button onClick={toUserView} className='block'>
        Fuskknapp!
      </button>
    </div>
  );
};

module.exports = LoginView;
