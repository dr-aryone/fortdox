import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import LinkDocument from './LinkDocument';
import Modal from 'components/general/Modal';

const plugins = 'lists table autoresize';

const toolbar =
  'styleselect | bold italic | markdownCode blockquote | bullist numlist | link table | privateKey password customCopy linkDocument';

const formats = {
  codeMark: { inline: 'code' },
  blockquote: { block: 'blockquote' },
  privateKey: {
    block: 'div',
    classes: 'rich-text-private-key'
  },
  copy: {
    block: 'div',
    classes: 'rich-text-copy'
  },
  password: {
    block: 'div',
    classes: 'rich-text-password'
  }
};

const style_formats = [
  { title: 'Heading 1', block: 'h1' },
  { title: 'Heading 2', block: 'h2' },
  { title: 'Heading 3', block: 'h3' },
  { title: 'Heading 4', block: 'h4' },
  { title: 'Heading 5', block: 'h5' }
];

const table_default_styles = { 'border-collapsed': 'none', width: '100%' };

const table_default_attributes = { border: 0 };

class RichText extends Component {
  constructor(props) {
    super(props);
    this.setup = this.setup.bind(this);
    this.onLinkDocumentButtonClick = this.onLinkDocumentButtonClick.bind(this);
    this.onCloseLinkDocumentModal = this.onCloseLinkDocumentModal.bind(this);
    this.onLinkButtonClick = this.onLinkButtonClick.bind(this);
    this.onCloseLinkModal = this.onCloseLinkModal.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.state = {
      showLinkDocumentModal: false,
      showLinkModal: false,
      url: '',
      urlText: ''
    };
  }

  setup(editor) {
    this.setState({ activeEditor: editor });
    editor.addButton('markdownCode', {
      icon: 'code',
      tooltip: 'Code',
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'codeMark');
      },
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('codeMark', function(state) {
            btn.active(state);
          });
        });
      }
    });
    editor.addButton('privateKey', {
      icon: 'vpn_key material-icons',
      tooltip: 'Private Key',
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'privateKey');
      },
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('privateKey', function(state) {
            btn.active(state);
          });
        });
      }
    });
    editor.addButton('customCopy', {
      icon: 'copy',
      tooltip: 'Copy',
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'copy');
      },
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('copy', function(state) {
            btn.active(state);
          });
        });
      }
    });
    editor.addButton('password', {
      icon: 'lock',
      tooltip: 'Password',
      onclick: function() {
        editor.execCommand('mceToggleFormat', false, 'password');
      },
      onpostrender: function() {
        var btn = this;
        editor.on('init', function() {
          editor.formatter.formatChanged('password', function(state) {
            btn.active(state);
          });
        });
      }
    });
    editor.addButton('linkDocument', {
      icon: 'link-document material-icons',
      tooltip: 'Link Document',
      onclick: this.onLinkDocumentButtonClick
    });

    editor.addButton('link', {
      icon: 'link',
      tooltip: 'Hyperlink',
      onclick: this.onLinkButtonClick
    });
  }

  onLinkDocumentButtonClick() {
    this.setState({
      showLinkDocumentModal: true
    });
  }

  onLinkButtonClick() {
    this.setState({
      showLinkModal: true
    });
  }

  onCloseLinkDocumentModal() {
    this.setState({
      showLinkDocumentModal: false
    });
  }

  onCloseLinkModal() {
    this.setState({
      showLinkModal: false
    });
  }

  onLinkModalChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleEditorChange(content) {
    const { id, type } = this.props;
    this.props.onChange(id, content, type);
  }

  appendDocumentLink(name, id) {
    this.state.activeEditor.insertContent(
      `<span class='document-link' data-id='${id}'>${name}</span>`
    );

    this.setState({
      showLinkDocumentModal: false
    });
  }

  appendLink() {
    let url = this.state.url;
    let urlText = this.state.urlText;
    this.state.activeEditor.insertContent(`<a href='${url}'>${urlText}</a>`);

    this.setState({
      showLinkModal: false,
      url: '',
      urlText: ''
    });
  }

  render() {
    const linkDocumentModal = (
      <Modal
        show={this.state.showLinkDocumentModal}
        onClose={this.onCloseLinkDocumentModal}
      >
        <LinkDocument
          linkOnClick={(name, id) => {
            this.appendDocumentLink(name, id);
          }}
          onClose={this.onCloseLinkDocumentModal}
        />
      </Modal>
    );

    const linkModal = (
      <Modal show={this.state.showLinkModal} onClose={this.onCloseLinkModal}>
        <div className='link-modal'>
          <h2>Insert Link</h2>
          <span>
            <b>URL:</b>
            <input
              name='url'
              onChange={e => this.onLinkModalChange(e)}
              value={this.state.url}
            />
          </span>
          <span>
            <b>Text to display:</b>
            <input
              name='urlText'
              onChange={e => this.onLinkModalChange(e)}
              value={this.state.urlText}
            />
          </span>
          <div className='buttons'>
            <button type='button' onClick={this.onCloseLinkModal}>
              Cancel
            </button>
            <button type='button' onClick={() => this.appendLink()}>
              Insert
            </button>
          </div>
        </div>
      </Modal>
    );

    return (
      <div>
        {this.state.showLinkDocumentModal && linkDocumentModal}
        {this.state.showLinkModal && linkModal}
        <Editor
          value={this.props.text}
          init={{
            autoresize_min_height: 200,
            autoresize_max_height: 550,
            setup: this.setup,
            style_formats,
            formats,
            plugins,
            toolbar,
            table_default_styles,
            table_default_attributes,
            branding: false,
            menubar: false,
            target_list: false,
            link_title: false,
            entity_encoding: 'raw',
            content_css: './css/index.css'
          }}
          onEditorChange={this.handleEditorChange}
        />
      </div>
    );
  }
}

export default RichText;
