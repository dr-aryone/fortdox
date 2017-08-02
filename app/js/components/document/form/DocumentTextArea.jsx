const React = require('react');

const DocumentTextArea = ({input, type, onChange, onRemoveField}) => {
  return (
    <div className={`input-field ${input.get('error') ? 'warning' : ''}`}>
      <label>
        {input.get('label')}
        <i className='material-icons' onClick={() => onRemoveField(input.get('id'))}>delete</i>
      </label>
      <textarea
        name={input.get('id')}
        onChange={(event) => onChange(event, type)}
        value={input.get('value')}
      />
      <div className='arrow_box'>
        <span className='material-icons'>error_outline</span>
        {input.get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentTextArea;
