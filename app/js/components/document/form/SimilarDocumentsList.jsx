const React = require('react');

class SimilarDocumentsList extends React.Component {
  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
  }

  componentWillMount() {
    window.addEventListener('click', this.close);
  }

  close() {
    if (this.props.onClose && this.props.list.size !== 0) {
      this.props.onClose();
    }
  }

  render() {
    let {list, onClick} = this.props;
    let hide = list.size === 0;
    list = list.map(entry => (
      <li
        key={entry.get('_id')}
        onClick={() => onClick(entry.get('_id'))}
      >
        <p>{entry.get('title')}</p>
        <span className='material-icons'>open_in_new</span>
      </li>
    ));
    return (
      <div className={`similar-documents-list box ${hide ? '' : 'show'}`}>
        <h3>Similar documents</h3>
        <ul>{list}</ul>
      </div>
    );
  }
}


module.exports = SimilarDocumentsList;
