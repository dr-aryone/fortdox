const React = require('react');
const Form = require('components/general/Form');

const UpdateDocView = ({input, onChange, onUpdate, onDelete, toSearchView}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <Form header='Update Document' input={input} onChange={onChange}>
          <br />
          <a onClick={toSearchView} className='btn'>Back</a>
          <a onClick={onUpdate} className='btn'>Update</a>
          <a onClick={onDelete} className='btn'>Delete</a>
        </Form>
      </div>
    </div>
  );
};

module.exports = UpdateDocView;
