const React = require('react');
const InputField = require('./InputField');

const LoginView = ({input, onChange}) => {
  return (
    <div>
      <h1> Welcome </h1>
      <InputField
        label='Username: '
        name='userInput'
        type='text'
        value={input.userInputValue}
        onChange={onChange}
      />
      <InputField
        label='Password: '
        name='passwordInput'
        type='password'
        value={input.passwordInputValue}
        onChange={onChange}
      />
      <button> Login </button>
      <button> Register </button>
    </div>
  );
};

module.exports = LoginView;
