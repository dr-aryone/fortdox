const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const InviteUserView = ({fields, message, error, onChange, onSend, isLoading}) => {
  let messageBox = message ? (
    <div className='alert alert-success'>
      <i className='material-icons'>
        check
      </i>
      {message}
    </div>
  ) : null;

  let errorMsg = fields.getIn(['email', 'error']) ? (
    <div className='arrow_box show'>
      <span className='material-icons'>error_outline</span>
      {fields.getIn(['email', 'error'])}
    </div>
  ) : null;

  let errorBox = error ? (
    <div className='alert alert-warning'>
      <i className='material-icons'>error_outline</i>
      {error}
    </div>
  ) : null;

  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <h1>Invite User</h1>
        <div className='box'>
          {messageBox}
          {errorBox}
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
