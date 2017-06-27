const React = require('react');

const SearchItem = ({title, text, onUpdate}) => {
  return (
    <div>
      <br />
      Title:
      <h2>{title}</h2>
      Text:
      <p>{text}</p>
      <button onClick={onUpdate}>
        Edit
      </button>
    </div>
  );
};

module.exports = SearchItem;
