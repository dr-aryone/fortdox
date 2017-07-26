const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');
const ErrorBox = require('components/general/ErrorBox');

class UpdateDocView extends React.Component {
  componentWillMount () {
    if (this.props.onMount) {
      this.props.onMount(this.props);
    }
  }

  render () {
    let {
      docFields,
      tags,
      error,
      onAddTag,
      onRemoveTag,
      onChange,
      onUpdate,
      toSearchView,
      isLoading
    } = this.props;


    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <ErrorBox errorMsg={error} />
          <h1>Update Document</h1>
          <DocumentForm
            docFields={docFields}
            tags={tags}
            onChange={onChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSubmit={onUpdate}
          >
            <button onClick={onUpdate} type='submit'>Update</button>
            <button onClick={toSearchView} type='button'>Back</button>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

module.exports = UpdateDocView;
