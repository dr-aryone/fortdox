const React = require('react');
const Form = require('components/general/Form');
const LoaderOverlay = require('components/general/LoaderOverlay');

const CreateDocView = ({input, onChange, onCreate, isLoading}) => {
  return (
    <div className='container-fluid'>
      <div className='col-sm-10 col-sm-offset-1'>
        <LoaderOverlay display={isLoading} />
        <Form header='Create Document' input={input} onChange={onChange}>
          <br />
          <a onClick={onCreate} className='btn'>Create</a>
        </Form>
      </div>
    </div>
  );
};

module.exports = CreateDocView;
