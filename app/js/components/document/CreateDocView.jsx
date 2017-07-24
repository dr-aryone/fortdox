const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');

const CreateDocView = ({docFields, onChange, onCreate, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='inner-container'>
        <LoaderOverlay display={isLoading} />
        <h1>Create Document</h1>
        <DocumentForm docFields={docFields} onChange={onChange} onSubmit={onCreate}>
          <button onClick={onCreate} type='submit'>Create</button>
        </DocumentForm>
      </div>
    </div>
  );
};

module.exports = CreateDocView;
