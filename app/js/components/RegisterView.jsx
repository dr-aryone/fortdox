const React = require('react');
const InputField = require('./InputField');

const RegisterView = ({register, onChange}) => {
  return (
    <div>
      <h1>Register</h1>
      <InputField
        label='Username: '
        name='userInput'
        type='text'
        value={register.userInputValue}
        onChange={onChange}
      />
      <InputField
        label='Password: '
        name='passwordInput'
        type='password'
        value={register.userInputValue}
        onChange={onChange}
      />
      <InputField
        label='Re-type password: '
        name='rePasswordInput'
        type='password'
        value={register.userInputValue}
        onChange={onChange}
      />
      <button>Submit</button>
    </div>
  );
};

module.exports = RegisterView;
