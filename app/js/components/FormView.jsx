const React = require('react');
const InputField = require('./InputField');

const FormView = ({input, onChange, onSubmit, toUserView}) => {
  return (
    <div>
      <h1>Document</h1>
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
        name='formValue'
        value={input.formValue}
      />
      <br />
      <button onClick={onSubmit}>Submit</button>
      <button onClick={toUserView}>Back</button>
    </div>
  );
};

module.exports = FormView;
