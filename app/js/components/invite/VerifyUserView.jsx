const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

class VerifyUserView extends React.Component {
  componentWillMount () {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  render () {
    let {
      input,
      isLoading,
      onChange,
      onSubmit,
      toLoginView,
      hasPrivateKey,
    } = this.props;
    let errorMsg = input.error ? input.errorMsg : null;

    return (
      <div className='login-panel'>
        <h1 className='text-center'>Register</h1>
        <LoaderOverlay display={isLoading} />
        <p>{errorMsg}</p>
        <div className={hasPrivateKey ? '' : 'hide'}>
          <label>Username:</label>
          <input
            name='usernameInputValue'
            type='text'
            value={input.usernameInputValue}
            onChange={onChange}
            className='input-block'
          />
          <label>Password:</label>
          <input
            name='passwordInputValue'
            type='password'
            value={input.passwordInputValue}
            onChange={onChange}
            className='input-block'
          />
          <label>Re-type password:</label>
          <input
            name='retypedInputValue'
            type='password'
            value={input.retypedInputValue}
            onChange={onChange}
            className='input-block'
          />
          <a onClick={onSubmit} className='btn btn-block'>
            Submit
          </a>
        </div>
        <a onClick={toLoginView} className='btn btn-block'>
          Back
        </a>
      </div>
    );
  }
}

module.exports = VerifyUserView;
