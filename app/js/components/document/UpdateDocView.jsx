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
      error,
      onAddTag,
      onRemoveTag,
      onChange,
      onSuggestTags,
      onUpdate,
      onAddField,
      onRemoveField,
      isLoading,
      toSearchView,
    } = this.props;

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <ErrorBox errorMsg={error} />
          <h1>Update Document</h1>
          <DocumentForm
            docFields={docFields}
            onChange={onChange}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSuggestTags={onSuggestTags}
            onSubmit={onUpdate}
            onAddField={onAddField}
            onRemoveField={onRemoveField}
          >
            <button onClick={toSearchView} type='button'>Back</button>
            <button onClick={onUpdate} type='submit'>Update</button>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

module.exports = UpdateDocView;
