const React = require('react');
const InputField = require('./InputField');

const SearchView = ({searchString, onChange, onSubmit, toUserView, result}) => {
  return (
    <div>
      <h1>Search</h1>
      <InputField
        label='Search: '
        name='searchString'
        type='text'
        value={searchString}
        onChange={onChange}
      />
      <button onClick={onSubmit}>Search</button>
      <button onClick={toUserView}>Back</button>
      <h2>{result.title}</h2>
      <h2>{result.text}</h2>
    </div>
  );
};

module.exports = SearchView;
