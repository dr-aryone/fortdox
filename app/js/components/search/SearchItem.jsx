const React = require('react');
const {List} = require('immutable');

const SearchItem = ({doc, onUpdate}) => {
  let title = doc.getIn(['_source', 'title']);
  let tags = doc.getIn(['_source', 'tags']) !== undefined ? doc.getIn(['_source', 'tags']) : List();
  let id = doc.getIn(['_id']);
  let tagList = [];
  tags.forEach((item, i) => {
    tagList.push(<div className='tag' key={i}>{item}</div>);
  });
  let text = [];
  if (doc.get('highlight') !== undefined) {
    let temp = doc.getIn(['highlight', 'texts.text']).first();
    let splitted = temp.split(/<b>|<\/b>/);
    text.push(splitted[0]);
    text.push(<b key={0}>{splitted[1]}</b>);
    text.push(splitted[2]);
  } else {
    if (doc.getIn(['_source', 'texts']).first() !== undefined) text.push(doc.getIn(['_source', 'texts']).first());
  }

  return (
    <div className='search-item box' onClick={() => onUpdate(id)}>
      <h2>{title}</h2>
      <p>{text}</p>
      {tagList}
    </div>
  );
};

module.exports = SearchItem;
