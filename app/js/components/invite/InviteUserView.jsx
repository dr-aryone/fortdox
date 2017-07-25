const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const MessageBox = require('components/general/MessageBox');
const ErrorBox = require('components/general/ErrorBox');

const InviteUserView = ({fields, message, error, onChange, onSend, isLoading}) => {
  let concatMessage = [];
  if (typeof message === 'object' && message !== null) {
    message.entrySeq().forEach((entry) => {
      entry[0] === 'bold' ? concatMessage.push(<b key={entry[1]}>{entry[1]}</b>) : concatMessage.push(entry[1]);
    });
  }

  let errorMsg = fields.getIn(['email', 'error']) ? (
    <div className='arrow_box show'>
      <span className='material-icons'>error_outline</span>
      {fields.getIn(['email', 'error'])}
    </div>
  ) : null;

  return (
    <div className='container-fluid'>
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <h1>Invite User</h1>
        <div className='box'>
          <MessageBox message={message} />
          <ErrorBox errorMsg={error} />
          <p>Invite a new user to the organization.</p>
          <form onSubmit={onSend} className='input-bar'>
            <input
              name='email'
              type='text'
              value={fields.getIn(['email', 'value'])}
              onChange={onChange}
              placeholder='Email'
              className='block'
              autoFocus
            />
            <button onClick={onSend}>Send</button>
          </form>
          {errorMsg}
        </div>
      </div>
    </div>
  );
};

module.exports = InviteUserView;
