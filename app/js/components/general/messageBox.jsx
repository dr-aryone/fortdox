const React = require('react');

const MessageBox = ({message}) => {
  return message ? (
    <div className='alert alert-success'>
      <i className='material-icons'>check</i>
      {message}
    </div>
  ) : null;
};

module.exports = MessageBox;
