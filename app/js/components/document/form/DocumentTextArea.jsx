const React = require('react');

const DocumentTextArea = ({input, type, onChange, onRemoveField}) => {
  return (
    <div className={`input-field ${input.get('error') ? 'warning' : ''}`}>
      <label>
        <h3>{input.get('label')}</h3>
        <i className='material-icons' onClick={() => onRemoveField(input.get('id'))}>delete</i>
      </label>
      <div className='textarea'>
        <textarea
          name={input.get('id')}
          onChange={(event) => onChange(event, type)}
          value={input.get('value')}
        />
      </div>
      <div className='arrow-box'>
        <span className='material-icons'>error_outline</span>
        {input.get('error')}
      </div>
    </div>
  );
};

module.exports = DocumentTextArea;
