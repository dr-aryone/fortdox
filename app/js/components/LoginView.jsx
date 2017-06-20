const React = require('react');
const InputField = require('./InputField');

const LoginView = ({input, onChange, onClick}) => {
  return (
    <div>
      <h1>Welcome!</h1>
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
      <button
        name='login'
        onClick={(e) => {
          onClick(e, input.userInputValue, input.passwordInputValue);
        }}
      >
        Login
      </button>
      <button
        name='register'
        onClick={(e) => {
          onClick(e, input.userInputValue, input.passwordInputValue);
        }}
      >
        Register
      </button>
    </div>
  );
};

module.exports = LoginView;
