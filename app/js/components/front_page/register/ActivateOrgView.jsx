const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

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
        <div className='arrow-box show'>
          <span className='material-icons'>error_outline</span>
          {entry[1].get('error')}
        </div>
      ) : null;
    });

    return (
      <div className='container'>
        <LoaderOverlay display={register.isLoading} />
        <ErrorBox errorMsg={register.verifyCodeError} />
        <ErrorBox errorMsg={register.activateOrgError} />
        <h1 className='text-center'>Register Team</h1>
        <div className='box'>
          <form className={register.verifyCodeError ? 'hide' : ''} onSubmit={onRegister}>
            <label>Password:</label>
            <input
              name='password'
              type='password'
              onChange={onChange}
              value={activateFields.getIn(['password', 'value'])}
              className='input-block'
              placeholder='at least 8 characters long'
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
