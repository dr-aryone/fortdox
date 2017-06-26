const React = require('react');
const Form = require('./Form');

const UpdateDocView = ({input, onChange, onUpdate, toSearchView}) => {
  return (
    <div>
      <Form header='Update Document' input={input} onChange={onChange} />
      <br />
      <button onClick={toSearchView}>Back</button>
      <button onClick={onUpdate}>Update</button>
    </div>
  );
};

module.exports = UpdateDocView;
