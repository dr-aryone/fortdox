const React = require('react');

const RegisterTeamView = ({register, onChange, onRegister, toRegisterTeamView}) => {
  let errorMsg = register.verifyError ? <h2>{register.errorMsg}</h2> : null;
  return (
    <div className='login-panel'>
      <h1>Create a New Team</h1>
      {errorMsg}
      <label>Password:</label>
      <input
        name='passwordInputValue'
        type='password'
        value={register.passwordInputValue}
        onChange={onChange}
        className='input-block'
      />
      <label>Re-type password:</label>
      <input
        name='reTypedPasswordInputValue'
        type='password'
        value={register.reTypedPasswordInputValue}
        onChange={onChange}
        className='input-block'
      />
      <a onClick={onRegister} className='btn'>
        Next
      </a>
      <a onClick={toRegisterTeamView} className='btn'>
        Back
      </a>
    </div>
  );
};

module.exports = RegisterTeamView;
