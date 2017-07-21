const React = require('react');
const {readStorage} = require('actions/utilities/storage');
const config = require('../../../../config.json');
const MessageBox = require('components/general/MessageBox');

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

  let concatMessage;
  if (typeof message === 'object' && message !== null) {
    concatMessage = [];
    message.entrySeq().forEach((entry) => {
      entry[0] === 'bold' ? concatMessage.push(<b key={entry[1]}>{entry[1]}</b>) : concatMessage.push(entry[1]);
    });
  } else {
    concatMessage = message;
  }

  return (
    <div className='container'>
      <MessageBox message={concatMessage} />
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
