const React = require('react');
const DocumentInputField = require('./DocumentInputField');
const DocumentTextArea = require('./DocumentTextArea');

const DocumentForm = ({onSubmit, docFields, onChange, children}) => {
  let fields = [];
  docFields.entrySeq().forEach((entry) => {
    if (entry[0] == 'title') fields.push(
      <DocumentInputField input={entry} onChange={onChange} key={entry[0]} />
    );
    else fields.push(
      <DocumentTextArea input={entry} onChange={onChange} key={entry[0]} />
    );
  });

  return (
    <form onSubmit={onSubmit} className='box'>
      {fields}
      {children}
    </form>
  );
};

module.exports = DocumentForm;
