const React = require('react');

const DocumentTextArea = ({input, onChange}) => {
  return (
    <div className={`input-field ${input[1].get('error') ? 'warning' : ''}`}>
      <label>{input[1].get('label')}</label>
      <textarea
        name={input[0]}
        onChange={onChange}
        value={input[1].get('value')}
      />
      <div className='arrow_box'>
        <span className='material-icons'>error_outline</span>
        {input[1].get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentTextArea;
