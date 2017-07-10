const React = require('react');
const Form = require('components/general/Form');
const LoaderOverlay = require('components/general/LoaderOverlay');

const UpdateDocView = ({input, onChange, onUpdate, onDelete, toSearchView, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
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
