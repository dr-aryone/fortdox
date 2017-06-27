const React = require('react');
const InputField = require('./InputField');

const Form = ({header, input, onChange}) => {
  return (
    <div>
      <h1>{header}</h1>
      <InputField
        label='Title: '
        name='titleValue'
        type='text'
        value={input.titleValue}
        onChange={onChange}
      />
      <h3> Text </h3>
      <textarea
        rows='10'
        cols='50'
        required onChange={onChange}
        name='textValue'
        value={input.textValue}
      />
    </div>
  );
};

module.exports = Form;
