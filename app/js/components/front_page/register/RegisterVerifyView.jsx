const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

class RegisterVerifyView extends React.Component {

  componentWillMount () {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }
  render () {
    let {
      register,
      onChange,
      onRegister,
      toLoginView
    } = this.props;

    let errorMsg = register.activateError ? <h2>{register.errorMsg}</h2> : null;
    return (
      <div className='login-panel'>
        <LoaderOverlay display={register.isLoading} />
        <h1 className='text-center'>Register Team</h1>
        {errorMsg}
        <div className={register.isVerified ? '' : 'hide'}>
          <label>Password:</label>
          <input
            name='passwordInputValue'
            type='password'
            onChange={onChange}
            value={register.passwordInputValue}
            className='input-block'
          />
          <label>Re-type password:</label>
          <input
            name='reTypedPasswordInputValue'
            type='password'
            onChange={onChange}
            value={register.reTypedPasswordInputValue}
            className='input-block'
          />
          <a onClick={onRegister} className='btn btn-block'>
            Register
          </a>
        </div>
        <a onClick={toLoginView} className='btn btn-block'>
          Back
        </a>
      </div>
    );
  }
}

module.exports = RegisterVerifyView;
