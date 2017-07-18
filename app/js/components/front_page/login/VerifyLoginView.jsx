const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const PasswordView = ({organization, email, input, onChange, onLogin, toLoginView, isLoading}) => {
  let errorMsg = input.error ? <h2>{input.errorMsg}</h2> : null;
  return (
    <div className='container'>
      <LoaderOverlay display={isLoading} />
      <h1 className='text-center'>{organization}</h1>
      <div className='box'>
        <h2>{email}</h2>
        {errorMsg}
        <form onSubmit={onLogin}>
          <label>Password</label>
          <input
            name='passwordInputValue'
            type='password'
            value={input.passwordInputValue}
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
