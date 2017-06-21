const React = require('react');
const InputField = require('./InputField');

const RegisterView = ({register, onChange, onRegister, onBack}) => {
  let errorMsg = register.error ? <h2>{register.errorMsg}</h2> : null;
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
      <button onClick={onRegister}>
        Submit
      </button>
      <button onClick={onBack}>
        Back
      </button>
    </div>
  );
};

module.exports = RegisterView;
