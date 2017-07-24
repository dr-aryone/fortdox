const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');

const UpdateDocView = ({docFields, onChange, onUpdate, toSearchView, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <h1>Update Document</h1>
        <DocumentForm docFields={docFields} onChange={onChange} onSubmit={onUpdate}>
          <button onClick={onUpdate} type='submit'>Update</button>
          <button onClick={toSearchView} type='button'>Back</button>
        </DocumentForm>
      </div>
    </div>
  );
};

module.exports = UpdateDocView;
