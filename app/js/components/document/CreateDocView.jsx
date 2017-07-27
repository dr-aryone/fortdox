const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');
const ErrorBox = require('components/general/ErrorBox');

class CreateDocView extends React.Component {
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
      onChange,
      onSuggestTags,
      onCreate,
      onAddTag,
      onRemoveTag,
      isLoading
    } = this.props;

    return (
      <div className='container-fluid'>
        <div className='inner-container'>
          <LoaderOverlay display={isLoading} />
          <ErrorBox errorMsg={error} />
          <h1>Create Document</h1>
          <DocumentForm
            docFields={docFields}
            tags={tags}
            onChange={onChange}
            onSuggestTags={onSuggestTags}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onSubmit={onCreate}
          >
            <button onClick={onCreate} type='submit'>Create</button>
          </DocumentForm>
        </div>
      </div>
    );
  }
}

module.exports = CreateDocView;
