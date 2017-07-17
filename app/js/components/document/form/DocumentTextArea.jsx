const React = require('react');

const DocumentTextArea = ({onSubmit, input, onChange, children}) => {
  return (
    <form onSubmit={onSubmit}>
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
    </form>
  );
};

module.exports = DocumentTextArea;
