import React from 'react';
import LoaderOverlay from 'components/general/LoaderOverlay';
import ErrorBox from 'components/general/ErrorBox';

const RegisterOrgView = ({
  registerFields,
  register,
  onChange,
  onCreateOrganization,
  toLoginView
}) => {
  let errorMsg = {};
  registerFields.entrySeq().forEach(entry => {
    errorMsg[entry[0]] = entry[1].get('error') ? (
      <div className='arrow-box show'>
        <span className='material-icons'>error_outline</span>
        {entry[1].get('error')}
      </div>
    ) : null;
  });

  return (
    <div className='container'>
      <LoaderOverlay display={register.isLoading} />
      <ErrorBox errorMsg={register.registerError} />
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

export default RegisterOrgView;
