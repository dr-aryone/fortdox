const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

const VerifyInviteView = props => {
  let { fields, error, isLoading, onChange, onVerifyUser, toLoginView } = props;
  let errorMsg = {};
  fields.entrySeq().forEach(entry => {
    errorMsg[entry[0]] = entry[1].get('error') ? (
      <div className='arrow-box show'>
        <span className='material-icons'>error_outline</span>
        {entry[1].get('error')}
      </div>
    ) : null;
  });
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
            value={fields.getIn(['uuid', 'value'])}
            onChange={onChange}
            className='input-block'
            autoFocus
          />
          {errorMsg.uuid}
          <label>Enter temporary password:</label>
          <input
            name='temporaryPassword'
            type='text'
            value={fields.getIn(['temporaryPassword', 'value'])}
            onChange={onChange}
            className='input-block'
          />
          {errorMsg.temporaryPassword}
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
