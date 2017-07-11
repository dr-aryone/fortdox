const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const InviteUserView = ({emailInputValue, error, errorMsg, onChange, onSend, isLoading}) => {
  let message = error ? errorMsg : null;
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <h1>Invite User</h1>
        <div className='box'>
          <p>Invite a new user to the organization.</p>
          {message}
          <div className='input-bar'>
            <input
              name='emailInputValue'
              type='text'
              value={emailInputValue}
              onChange={onChange}
              placeholder='Email'
              className='block'
            />
            <a onClick={onSend} className='btn'>Send</a>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = InviteUserView;
