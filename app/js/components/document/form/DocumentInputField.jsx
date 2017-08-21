const React = require('react');

const DocumentInputField = ({input, type, onChange}) => {
  return (
    <div className={`input-field ${input.get('error') ? 'warning' : ''}`}>
      <label><h3>{input.get('label')}</h3></label>
      <input
        name={input.get('id')}
        onChange={onChange}
        type={type}
        value={input.get('value')}
      />
      <div className='arrow-box'>
        <span className='material-icons'>error_outline</span>
        {input.get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentInputField;
