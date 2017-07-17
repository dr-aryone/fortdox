const React = require('react');

const DocumentInputField = ({input, onChange}) => {
  debugger;
  return (
    <div className={`input-field ${docFields.getIn(['title', 'error']) ? 'warning' : ''}`}>
      <label>Title</label>
      <input
        name='title'
        onChange={onChange}
        type='text'
        value={docFields.getIn(['title', 'value'])}
      />
      <div className='arrow_box'>
        <span className='material-icons'>error_outline</span>
        {docFields.getIn(['title', 'error'])}
      </div>
    </div>
  );
};

module.exports = DocumentInputField;
