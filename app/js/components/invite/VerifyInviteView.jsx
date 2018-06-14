const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

const VerifyInviteView = props => {
  let {
    uuid,
    temporaryPassword,
    error,
    isLoading,
    onChange,
    onVerifyUser,
    toLoginView
  } = props;
  return (
    <div className='container'>
      <LoaderOverlay display={isLoading} />
      <ErrorBox errorMsg={error} />
      <h1 className='text-center'>Join an Existing Team</h1>
      <div className='box'>
        <form onSubmit={onVerifyUser}>
          <label>Enter invitation code:</label>
          <input
            name='uuid'
            type='text'
            value={uuid}
            onChange={onChange}
            className='input-block'
            autoFocus
          />
          <label>Enter temporary password:</label>
          <input
            name='temporaryPassword'
            type='text'
            value={temporaryPassword}
            onChange={onChange}
            className='input-block'
          />
          <button onClick={onVerifyUser} className='block' type='submit'>
            Submit
          </button>
        </form>
        <button onClick={toLoginView} className='block'>
          Back
        </button>
      </div>
    </div>
  );
};

module.exports = VerifyInviteView;
