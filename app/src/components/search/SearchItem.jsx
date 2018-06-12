const React = require('react');
const { List } = require('immutable');

class SearchItem extends React.Component {
  constructor() {
    super();
    this.handleKeyboardClick = this.handleKeyboardClick.bind(this);
  }
  handleKeyboardClick(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
      this.wrapper.click();
      event.preventDefault();
    }
  }

  componentDidMount() {
    this.wrapper.addEventListener('keypress', this.handleKeyboardClick);
  }
  componentWillUnmount() {
    this.wrapper.removeEventListener('keypress', this.handleKeyboardClick);
  }

  render() {
    const { doc, onUpdate, onPreview, onTagSearch } = this.props;
    let title = doc.getIn(['_source', 'title']);
    let tags =
      doc.getIn(['_source', 'tags']) !== undefined
        ? doc.getIn(['_source', 'tags'])
        : List();
    let id = doc.getIn(['_id']);
    let tagList = [];
    tags.forEach((item, i) => {
      tagList.push(
        <div
          className='tag'
          id='TAG'
          key={i}
          onClick={event => clickHandler(event, 'TAG', item)}
        >
          {item}
        </div>
      );
    });

    let text = [];
    if (doc.getIn(['highlight', 'texts.text']) !== undefined) {
      let temp = doc
        .getIn(['highlight', 'texts.text'])
        .first()
        .split(/%%#%%|%%#%%/);
      if (temp.length > 10) temp.forEach(str => text.push(str));
      else
        temp.forEach(
          (str, index) =>
            index % 2 === 0
              ? text.push(str)
              : text.push(
                <span className='highlight' key={index}>
                  {str}
                </span>
              )
        );
    } else {
      if (doc.getIn(['_source', 'texts']) !== undefined) {
        let texts = doc.getIn(['_source', 'texts']);
        let currentLength = 0;
        let maxLength = 250;
        for (let i = 0; i < texts.size; i++) {
          if (texts.get(i).get('text').length + currentLength > maxLength) {
            text.push(
              texts
                .get(i)
                .get('text')
                .slice(0, maxLength - currentLength)
            );
            break;
          } else {
            text.push(texts.get(i).get('text'));
            currentLength += texts.get(i).get('text').length;
          }
        }
      }
    }

    let textBox = text.length > 0 ? <p className='text'>{text}</p> : null;
    let tagBox =
      tagList.length > 0 ? <div className='tags'>{tagList}</div> : null;
    const clickHandler = (event, element, item) => {
      event.stopPropagation();
      switch (element) {
        case 'EDIT':
          return onUpdate(item);
        case 'ITEM':
          return onPreview(item);
        case 'TAG':
          return onTagSearch(item);
        default:
          console.error('Unexpected element');
      }
    };

    return (
      <div
        ref={e => (this.wrapper = e)}
        className='search-item'
        tabIndex={0}
        id='ITEM'
        onClick={event => clickHandler(event, 'ITEM', id)}
      >
        <div>
          <div className='title'>
            <h2>{title}</h2>
            <button
              tabIndex={-1}
              className='round small material-icons'
              id='EDIT'
              onClick={event => clickHandler(event, 'EDIT', id)}
            >
              edit
            </button>
          </div>
          {textBox}
        </div>
        {tagBox}
      </div>
    );
  }
}

module.exports = SearchItem;
