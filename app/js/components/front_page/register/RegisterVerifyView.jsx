const React = require('react');

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
      toRegisterView
    } = this.props;

    let errorMsg = register.activateError ? <h2>{register.errorMsg}</h2> : null;
    return (
      <div className='login-panel'>
        <h1 className='text-center'>{register.organizationInputValue}</h1>
        {errorMsg}
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
        <a onClick={toRegisterView} className='btn btn-block'>
          Back
        </a>
      </div>
    );
  }
}

module.exports = RegisterVerifyView;
