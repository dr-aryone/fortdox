const React = require('react');

const Form = ({header, input, onChange, children}) => {
  return (
    <div>
      <h1>{header}</h1>
      <div className='box'>
        <label>Title</label>
        <input
          name='titleValue'
          type='text'
          value={input.titleValue}
          onChange={onChange}
          className='input-block'
        />
        <label>Text</label>
        <textarea
          rows='10'
          cols='50'
          required onChange={onChange}
          name='textValue'
          value={input.textValue}
        />
        {children}
      </div>
    </div>
  );
};

module.exports = Form;
