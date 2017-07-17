const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');

const UpdateDocView = ({docFields, onChange, onUpdate, onDelete, toSearchView, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <h1>Update Document</h1>
        <form className='box' onSubmit={onUpdate}>
          <label>Title</label>
          <div>
            <input
              name='title'
              onChange={onChange}
              type='text'
              value={docFields.getIn(['title', 'value'])}
              className='input-block'
            />
          </div>
          <label>Text</label>
          <textarea
            name='text'
            required onChange={onChange}
            value={docFields.getIn(['text', 'value'])}
          />
          <br />
          <button type='submit' className='btn'>Update</button>
          <a onClick={toSearchView} className='btn'>Back</a>
          <a onClick={onDelete} className='btn'>Delete</a>
        </form>
      </div>
    </div>
  );
};

module.exports = UpdateDocView;
