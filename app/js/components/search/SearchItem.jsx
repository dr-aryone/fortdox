const React = require('react');

const SearchItem = ({title, text, onUpdate}) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{text}</p>
      <button onClick={onUpdate}>
        Edit
      </button>
    </div>
  );
};

module.exports = SearchItem;
