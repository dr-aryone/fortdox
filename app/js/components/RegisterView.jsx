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
        value={register.username}
        onChange={onChange}
      />
      <InputField
        label='Password: '
        name='passwordInput'
        type='password'
        value={register.password}
        onChange={onChange}
      />
      <InputField
        label='Re-type password: '
        name='rePasswordInput'
        type='password'
        value={register.reTypedPassword}
        onChange={onChange}
      />
      <button>Submit</button>
    </div>
  );
};

module.exports = RegisterView;
