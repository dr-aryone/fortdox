const React = require('react');

const RegisterTeamView = ({register, onChange, onVerify, toLoginView}) => {
  let errorMsg = register.teamNameError ? <h2>{register.errorMsg}</h2> : null;
  return (
    <div className='login-panel'>
      <h1>Create a New Team</h1>
      {errorMsg}
      <label>Team name:</label>
      <input
        name='organizationInputValue'
        type='text'
        value={register.organizationInputValue}
        onChange={onChange}
        className='input-block'
      />
      <label>Username:</label>
      <input
        name='usernameInputValue'
        type='text'
        value={register.userna}
        onChange={onChange}
        className='input-block'
      />
      <a onClick={onVerify} className='btn btn-block'>
        Next
      </a>
      <a onClick={toLoginView} className='btn btn-block'>
        Back
      </a>
    </div>
  );
};

module.exports = RegisterTeamView;
