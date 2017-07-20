const React = require('react');

const ErrorBox = ({errorMsg}) => {
  return errorMsg ? (
    <div className='alert alert-warning'>
      <i className='material-icons'>error_outline</i>
      {errorMsg}
    </div>
  ) : null;
};

module.exports = ErrorBox;
