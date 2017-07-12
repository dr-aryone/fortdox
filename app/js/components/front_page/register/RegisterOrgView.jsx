const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const RegisterOrgView = ({register, onChange, onCreateOrganization, toLoginView}) => {
  let errorMsg = register.orgNameError ? <h2>{register.errorMsg}</h2> : null;
  return (
    <div className='container box'>
      <LoaderOverlay display={register.isLoading} />
      <h1 className='text-center'>Create a New Team</h1>
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
        value={register.usernameInputValue}
        onChange={onChange}
        className='input-block'
      />

      <label>E-mail:</label>
      <input
        name='emailInputValue'
        type='text'
        value={register.emailInputValue}
        onChange={onChange}
        className='input-block'
      />
      <a onClick={onCreateOrganization} className='btn btn-block'>
        Register Team
      </a>
      <a onClick={toLoginView} className='btn btn-block'>
        Back
      </a>
    </div>
  );
};

module.exports = RegisterOrgView;
