const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const PasswordView = ({
  organization,
  email,
  input,
  onChange,
  onLogin,
  toLoginView,
  isLoading,
  warning
}) => {
  let errorMsg = input.error ? (
    <div className='alert alert-danger'>
      <i className='material-icons'>error_outline</i>
      {input.error}
    </div>
  ) : null;

  let warningMsg = warning ? (
    <div className='alert alert-warning'>
      <i className='material-icons'>warning</i>
      {warning}
    </div>
  ) : null;

  return (
    <div className='container'>
      <LoaderOverlay display={isLoading} />
      {errorMsg}
      {warningMsg}
      <div className='logo'>
        <img src={window.__dirname + '/resources/logo.png'} />
      </div>
      <h1 className='text-center'>{organization}</h1>
      <div className='box'>
        <h2>{email}</h2>
        <form onSubmit={onLogin}>
          <label>Password</label>
          <input
            name='password'
            type='password'
            value={input.password}
            onChange={onChange}
            className='input-block'
            autoFocus
          />
          <button onClick={onLogin} className='block' type='submit'>
            Login
          </button>
          <button onClick={toLoginView} className='block' type='button'>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

module.exports = PasswordView;
