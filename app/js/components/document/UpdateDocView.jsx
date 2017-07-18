const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');

const UpdateDocView = ({docFields, onChange, onUpdate, toSearchView, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <h1>Update Document</h1>
        <DocumentForm docFields={docFields} onChange={onChange} onSubmit={onUpdate}>
          <a onClick={onUpdate} className='btn' onSubmit={onUpdate}>Update</a>
          <a onClick={toSearchView} className='btn'>Back</a>
        </DocumentForm>
      </div>
    </div>
  );
};

module.exports = UpdateDocView;
