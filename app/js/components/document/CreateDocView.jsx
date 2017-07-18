const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');

const CreateDocView = ({docFields, onChange, onCreate, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
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
