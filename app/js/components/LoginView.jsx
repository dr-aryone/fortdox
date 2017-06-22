const React = require('react');
const InputField = require('./InputField');

const LoginView = ({input, onChange, onLogin, onRegister, toUserView}) => {
  let errorMsg = input.error ? <h2>{input.errorMsg}</h2> : null;

  return (
    <div>
      <h1>Welcome!</h1>
      {errorMsg}
      <InputField
        label='Username: '
        name='userInputValue'
        type='text'
        value={input.userInputValue}
        onChange={onChange}
      />
      <InputField
        label='Password: '
        name='passwordInputValue'
        type='password'
        value={input.passwordInputValue}
        onChange={onChange}
      />
      <button onClick={onLogin}>
        Login
      </button>
      <button onClick={onRegister}>
        Register
      </button>
      <button onClick={toUserView}>
        To user view
      </button>
    </div>
  );
};

module.exports = LoginView;
