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
      <div className='container box'>
        <LoaderOverlay display={register.isLoading} />
        <h1 className='text-center'>Register Team</h1>
        {errorMsg}
        <div className={register.isVerified ? '' : 'hide'}>
          <form onSubmit={onRegister}>
            <label>Password:</label>
            <input
              name='passwordInputValue'
              type='password'
              onChange={onChange}
              value={register.passwordInputValue}
              className='input-block'
              autoFocus
            />
            <label>Re-type password:</label>
            <input
              name='retypedPasswordInputValue'
              type='password'
              onChange={onChange}
              value={register.retypedPasswordInputValue}
              className='input-block'
            />
            <button onClick={onRegister} className='block' type='submit'>
              Register
            </button>
          </form>
        </div>
        <button onClick={toLoginView} className='block' type='button'>
          Back
        </button>
      </div>
    );
  }
}

module.exports = RegisterVerifyView;
