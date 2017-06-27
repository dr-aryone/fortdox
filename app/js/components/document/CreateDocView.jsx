const React = require('react');
const Form = require('components/general/Form');

const CreateDocView = ({input, onChange, onCreate, toUserView}) => {
  return (
    <div>
      <Form header='Create Document' input={input} onChange={onChange} />
      <br />
      <button onClick={toUserView}>Back</button>
      <button onClick={onCreate}>Create</button>
    </div>
  );
};

module.exports = CreateDocView;
