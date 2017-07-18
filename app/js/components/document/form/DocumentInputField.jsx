const React = require('react');

const DocumentInputField = ({input, onChange}) => {
  return (
    <div className={`input-field ${input[1].get('error') ? 'warning' : ''}`}>
      <label>{input[1].get('label')}</label>
      <input
        name={input[0]}
        onChange={onChange}
        type='text'
        value={input[1].get('value')}
      />
      <div className='arrow_box'>
        <span className='material-icons'>error_outline</span>
        {input[1].get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentInputField;
