const React = require('react');

const SearchItem = ({title, text, onUpdate}) => {
  return (
    <div className='box' onClick={onUpdate}>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
};

module.exports = SearchItem;
