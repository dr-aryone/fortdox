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
      fields,
      error,
      isLoading,
      onChange,
      onSubmit,
      toLoginView,
      privateKey,
    } = this.props;

    let errorBox = error ? (
      <div className='alert alert-warning'>
        <span className='material-icons'>error_outline</span>
        {error}
      </div>
    ) : null;

    let errorMsg = {};
    fields.entrySeq().forEach((entry) => {
      errorMsg[entry[0]] = entry[1].get('error') ? (
        <div className='arrow_box show'>
          <span className='material-icons'>error_outline</span>
          {entry[1].get('error')}
        </div>
      ) : null;
    });

    return (
      <div className='container'>
        <LoaderOverlay display={isLoading} />
        {errorBox}
        <h1 className='text-center'>Register</h1>
        <div className='box'>
          <div className={privateKey ? '' : 'hide'}>
            <form onSubmit={onSubmit}>
              <label>Username:</label>
              <input
                name='username'
                type='text'
                value={fields.getIn(['username', 'value'])}
                onChange={onChange}
                className='input-block'
                autoFocus
              />
              {errorMsg.username}
              <label>Password: (at least 8 characters long)</label>
              <input
                name='password'
                type='password'
                value={fields.getIn(['password', 'value'])}
                onChange={onChange}
                className='input-block'
              />
              {errorMsg.password}
              <label>Re-type password:</label>
              <input
                name='retypedPassword'
                type='password'
                value={fields.getIn(['retypedPassword', 'value'])}
                onChange={onChange}
                className='input-block'
              />
              {errorMsg.retypedPassword}
              <button onClick={onSubmit} className='block' type='submit'>
                Submit
              </button>
            </form>
          </div>
          <button onClick={toLoginView} className='block'>
            Back
          </button>
        </div>
      </div>
    );
  }
}

module.exports = VerifyUserView;
