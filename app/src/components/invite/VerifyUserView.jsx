const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const ErrorBox = require('components/general/ErrorBox');

class VerifyUserView extends React.Component {
  componentWillMount() {
    if (this.props.onMount && !this.props.privateKey) {
      this.props.onMount(this.props);
    }
  }

  render() {
    let {
      fields,
      error,
      isLoading,
      onChange,
      onSubmit,
      toLoginView,
      privateKey
    } = this.props;

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
        <h1 className='text-center'>Register</h1>
        <div className='box'>
          <div className={privateKey ? '' : 'hide'}>
            <form onSubmit={onSubmit}>
              <label>Password:</label>
              <input
                name='password'
                type='password'
                value={fields.getIn(['password', 'value'])}
                onChange={onChange}
                placeholder='at least 8 characters long'
                className='input-block'
                autoFocus
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
