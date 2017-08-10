const React = require('react');
const {List} = require('immutable');

const SearchItem = ({doc, onUpdate, onPreview, onTagSearch}) => {
  let title = doc.getIn(['_source', 'title']);
  let tags = doc.getIn(['_source', 'tags']) !== undefined ? doc.getIn(['_source', 'tags']) : List();
  let id = doc.getIn(['_id']);
  let tagList = [];
  tags.forEach((item, i) => {
    tagList.push(<div className='tag' id='TAG' key={i} onClick={event => clickHandler(event, 'TAG', item)}>{item}</div>);
  });

  let text = [];
  if (doc.getIn(['highlight', 'texts.text']) !== undefined) {
    let temp = doc.getIn(['highlight', 'texts.text']).first().split(/%%#%%|%%#%%/);
    if (temp.length > 10) temp.forEach(str => text.push(str));
    else temp.forEach((str, index) => index % 2 === 0 ? text.push(str) : text.push(<span className='highlight' key={index}>{str}</span>));
  } else {
    if (doc.getIn(['_source', 'texts']) !== undefined) {
      let texts = doc.getIn(['_source', 'texts']);
      let currentLength = 0;
      let maxLength = 250;
      for (let i = 0; i < texts.size; i++) {
        if (texts.get(i).get('text').length + currentLength > maxLength) {
          text.push(texts.get(i).get('text').slice(0, (maxLength-currentLength)));
          break;
        } else {
          text.push(texts.get(i).get('text'));
          currentLength += texts.get(i).get('text').length;
        }
      }
    }
  }

  const clickHandler = (event, element, item) => {
    event.stopPropagation();
    switch (element) {
      case 'EDIT':
        return onUpdate(item);
      case 'ITEM':
        return onPreview(item);
      case 'TAG':
        return onTagSearch(item);
    }
  };

  return (
    <div className='search-item' id='ITEM' onClick={event => clickHandler(event, 'ITEM', id)}>
      <button className='round small material-icons' id='EDIT' onClick={event => clickHandler(event, 'EDIT', id)}>edit</button>
      <h2 className='title'>{title}</h2>
      <p className='text'>{text}</p>
      <div className='tags'>{tagList}</div>
    </div>
  );
};

module.exports = SearchItem;
