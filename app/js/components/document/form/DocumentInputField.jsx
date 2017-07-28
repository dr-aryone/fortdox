const React = require('react');

const DocumentInputField = ({input, type, onChange}) => {
  return (
    <div className={`input-field ${input.get('error') ? 'warning' : ''}`}>
      <label>{input.get('label')}</label>
      <input
        name={input.get('id')}
        onChange={(event) => onChange(event, type)}
        type={type}
        value={input.get('value')}
      />
      <div className='arrow_box'>
        <span className='material-icons'>error_outline</span>
        {input.get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentInputField;
