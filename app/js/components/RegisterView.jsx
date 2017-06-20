const React = require('react');
const InputField = require('./InputField');

const RegisterView = ({register, onChange, onClick}) => {
  let errorMsg = register.error ? <h2>Please chose another username, DIKSHIT</h2> : null;

  return (
    <div>
      <h1>Register</h1>
      {errorMsg}
      <InputField
        label='Username: '
        name='username'
        type='text'
        value={register.username}
        onChange={onChange}
      />
      <InputField
        label='Password: '
        name='password'
        type='password'
        value={register.password}
        onChange={onChange}
      />
      <InputField
        label='Re-type password: '
        name='reTypedPassword'
        type='password'
        value={register.reTypedPassword}
        onChange={onChange}
      />
      <button
        name='register'
        onClick={(e) => {
          onClick(e, register.username, register.password, register.reTypedPassword);
        }}
      >
        Submit
      </button>
    </div>
  );
};

module.exports = RegisterView;
