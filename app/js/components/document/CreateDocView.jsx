const React = require('react');
const Form = require('components/general/Form');

const CreateDocView = ({input, onChange, onCreate, toUserView}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <Form header='Create Document' input={input} onChange={onChange} />
        <br />
        <button onClick={toUserView}>Back</button>
        <button onClick={onCreate}>Create</button>
      </div>
    </div>
  );
};

module.exports = CreateDocView;
