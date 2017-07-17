const React = require('react');
const LoaderOverlay = require('components/general/LoaderOverlay');
const DocumentForm = require('./form/DocumentForm');

const CreateDocView = ({docFields, onChange, onCreate, isLoading}) => {
  return (
  //   <div className='container-fluid'>
  //     <div className='col-sm-10 col-sm-offset-1'>
  //       <LoaderOverlay display={isLoading} />
  //       <h1>Create Document</h1>
  //       <form className='box' onSubmit={onCreate}>
  //         <div className={`input-field ${docFields.getIn(['title', 'error']) ? 'warning' : ''}`}>
  //           <label>Title</label>
  //           <input
  //             name='title'
  //             onChange={onChange}
  //             type='text'
  //             value={docFields.getIn(['title', 'value'])}
  //           />
  //           <div className='arrow_box'>
  //             <span className='material-icons'>error_outline</span>
  //             {docFields.getIn(['title', 'error'])}
  //           </div>
  //         </div>
  //         <label>Text</label>
  //         <div className={`input-field ${docFields.getIn(['text', 'error']) ? 'warning' : ''}`}>
  //           <textarea
  //             name='text'
  //             required onChange={onChange}
  //             value={docFields.getIn(['text', 'value'])}
  //           />
  //           <div className='arrow_box'>
  //             <span className='material-icons'>error_outline</span>
  //             {docFields.getIn(['title', 'error'])}
  //           </div>
  //         </div>
  //       </form>
  //       <a onClick={onCreate} className='btn' onSubmit={onCreate}>Create</a>
  //     </div>
  //   </div>
    <DocumentForm
      docFields={docFields}
      onChange={onChange}
    />
  );
};

module.exports = CreateDocView;
