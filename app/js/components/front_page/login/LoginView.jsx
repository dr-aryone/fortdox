const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const LoginView = ({input, message, onChange, onLogin, toUserView, toRegisterView, isLoading}) => {
  let errorMsg = input.error ? <h2>{input.errorMsg}</h2> : null;
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
      <div className='box'>
        <h1 className='text-center'>FortDoks</h1>
        <LoaderOverlay display={isLoading} />
        {errorMsg}
        <label>Email:</label>
        <input
          name='emailInputValue'
          type='text'
          value={input.emailInputValue}
          onChange={onChange}
          className='input-block'
        />
        <label>Password:</label>
        <input
          name='passwordInputValue'
          type='password'
          value={input.passwordInputValue}
          onChange={onChange}
          className='input-block'
        />
        <a onClick={onLogin} className='btn btn-block'>
          Login
        </a>
        <a onClick={toRegisterView} className='btn btn-block'>
          Register a New Team
        </a>
        <a onClick={toUserView} className='btn btn-block'>
          Fusk knapp!
        </a>
      </div>
    </div>
  );
};

module.exports = LoginView;
