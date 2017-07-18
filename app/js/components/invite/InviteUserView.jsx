const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const InviteUserView = ({emailInputValue, message, error, errorMsg, onChange, onSend, isLoading}) => {
  let errMsg = error ? errorMsg : null;
  let messageBox = message ? (
    <div className='alert alert-success'>
      <i className='material-icons'>
        check
      </i>
      {message}
    </div>
  ) : null;
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <h1>Invite User</h1>
        <div className='box'>
          <p>Invite a new user to the organization.</p>
          {errMsg}
          {messageBox}
          <form onSubmit={onSend} className='input-bar'>
            <input
              name='emailInputValue'
              type='text'
              value={emailInputValue}
              onChange={onChange}
              placeholder='Email'
              className='block'
              autoFocus
            />
            <button onClick={onSend}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

module.exports = InviteUserView;
