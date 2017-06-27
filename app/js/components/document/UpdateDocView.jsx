const React = require('react');
const Form = require('components/general/Form');

const UpdateDocView = ({input, onChange, onUpdate, onDelete, toSearchView}) => {
  return (
    <div>
      <Form header='Update Document' input={input} onChange={onChange} />
      <br />
      <button onClick={toSearchView}>Back</button>
      <button onClick={onUpdate}>Update</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

module.exports = UpdateDocView;
