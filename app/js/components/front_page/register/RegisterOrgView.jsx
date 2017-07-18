const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const RegisterOrgView = ({registerFields, register, onChange, onCreateOrganization, toLoginView}) => {
  let errorMsg = {};
  registerFields.entrySeq().forEach((entry) => {
    errorMsg[entry[0]] = entry[1].get('error') ? (
      <div className='arrow_box show'>
        <span className='material-icons'>error_outline</span>
        {entry[1].get('error')}
      </div>
    ) : null;
  });

  let errorBox = register.registerError ? (
    <div className='alert alert-warning show'>
      <span className='material-icons'>error_outline</span>
      {register.registerError}
    </div>
  ) : null;

  return (
    <div className='container'>
      <LoaderOverlay display={register.isLoading} />
      {errorBox}
      <h1 className='text-center'>Create a New Team</h1>
      <form className='box' onSubmit={onCreateOrganization}>
        <label>Team name:</label>
        <input
          name='organization'
          type='text'
          value={registerFields.getIn(['organization', 'value'])}
          onChange={onChange}
          className='input-block'
          autoFocus
        />
        {errorMsg.organization}
        <label>Username:</label>
        <input
          name='username'
          type='text'
          value={registerFields.getIn(['username', 'value'])}
          onChange={onChange}
          className='input-block'
        />
        {errorMsg.username}
        <label>Email:</label>
        <input
          name='email'
          type='text'
          value={registerFields.getIn(['email', 'value'])}
          onChange={onChange}
          className='input-block'
        />
        {errorMsg.email}
        <button onClick={onCreateOrganization} className='block' type='submit'>
          Register Team
        </button>
        <button onClick={toLoginView} className='block' type='button'>
          Back
        </button>
      </form>
    </div>
  );
};

module.exports = RegisterOrgView;
