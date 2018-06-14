const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');
const MessageBox = require('components/general/MessageBox');

const VerifyOrgLinkView = ({
  register,
  activationCode,
  message,
  onChange,
  onVerifyCode,
  toLoginView
}) => {
  let concatMessage;
  if (typeof message === 'object' && message !== null) {
    concatMessage = [];
    message.entrySeq().forEach(entry => {
      entry[0] === 'bold'
        ? concatMessage.push(<b key={entry[1]}>{entry[1]}</b>)
        : concatMessage.push(entry[1]);
    });
  } else {
    concatMessage = message;
  }

  const emptyField = activationCode.get('error') ? (
    <div className='arrow-box show'>
      <span className='material-icons'>error_outline</span>
      {activationCode.get('error')}
    </div>
  ) : null;

  return (
    <div className='container'>
      <LoaderOverlay display={register.isLoading} />
      <ErrorBox errorMsg={register.verifyCodeError} />
      <MessageBox message={concatMessage} />
      <h1 className='text-center'>Verify Team</h1>
      <form className='box' onSubmit={onVerifyCode}>
        <label>Enter verification code:</label>
        <input
          name='code'
          type='text'
          value={activationCode.get('value')}
          onChange={onChange}
          className='input-block'
          autoFocus
        />
        {emptyField}
        <button onClick={onVerifyCode} className='block' type='submit'>
          Verify Team
        </button>
        <button onClick={toLoginView} className='block' type='button'>
          Back
        </button>
      </form>
    </div>
  );
};

module.exports = VerifyOrgLinkView;
