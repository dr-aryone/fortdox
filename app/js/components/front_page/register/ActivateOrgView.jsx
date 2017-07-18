const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

class ActivateOrgView extends React.Component {
  componentWillMount () {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  render () {
    let {
      activateFields,
      register,
      onChange,
      onRegister,
      toLoginView
    } = this.props;

    let errorMsg = {};
    activateFields.entrySeq().forEach((entry) => {
      errorMsg[entry[0]] = entry[1].get('error') ? (
        <div className='arrow_box show'>
          <span className='material-icons'>error_outline</span>
          {entry[1].get('error')}
        </div>
      ) : null;
    });

    let errorBox = register.verifyCodeError || register.activateOrgError ? (
      <div className='alert alert-warning'>
        <span className='material-icons'>error_outline</span>
        {register.verifyCodeError}
        {register.activateOrgError}
      </div>
    ) : null;

    return (
      <div className='container'>
        <LoaderOverlay display={register.isLoading} />
        {errorBox}
        <h1 className='text-center'>Register Team</h1>
        <div className='box'>
          <form className={register.verifyCodeError ? 'hide' : ''} onSubmit={onRegister}>
            <label>Password: (at least 8 characters long)</label>
            <input
              name='password'
              type='password'
              onChange={onChange}
              value={activateFields.getIn(['password', 'value'])}
              className='input-block'
              autoFocus
            />
            {errorMsg.password}
            <label>Re-type password:</label>
            <input
              name='retypedPassword'
              type='password'
              onChange={onChange}
              value={activateFields.getIn(['retypedPassword', 'value'])}
              className='input-block'
            />
            {errorMsg.retypedPassword}
            <button onClick={onRegister} className='block' type='submit'>
              Register
            </button>
          </form>
          <button onClick={toLoginView} className='block' type='button'>
            Back
          </button>
        </div>
      </div>
    );
  }
}

module.exports = ActivateOrgView;
