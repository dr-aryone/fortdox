const React = require('react');
const {dialog} = window.require('electron').remote;
const path = window.require('path');
const fs = window.require('fs');

class PrivateKey extends React.Component {
  constructor(props) {
    super(props);

    this.openSaveDialog = this.openSaveDialog.bind(this);
  }

  render() {
    let {title} = this.props;

    return (
      <div className='private-key'>
        <div>
          <h4>
            <span>Private key</span>
            <i className='material-icons'>vpn_key</i>
          </h4>
          <p className='file-name'>{title || 'unnamed.pem'}</p>
        </div>
        <div>
          <button onClick={this.openSaveDialog} className='material-icons round small'>file_download</button>
        </div>
      </div>
    );
  }

  openSaveDialog() {
    dialog.showSaveDialog(null, {
      title: this.props.title,
      defaultPath: `${process.env.HOME}/.ssh/${this.props.title}`
    }, fileName => this.writeFile(fileName, this.props.content));
  }

  writeFile(fileName, content) {
    if (fileName === undefined) {
      return;
    }

    fs.writeFile(fileName, content, (err) => {
      if (err) {
        if (this.props.onPrivateKeySaveFailed) {
          this.props.onPrivateKeySaveFailed();
        }
      }

      if (this.props.onPrivateKeySave) {
        this.props.onPrivateKeySave(path.basename(fileName));
      }
    });
  }
}

module.exports = PrivateKey;
