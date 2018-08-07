import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import LinkDocument from './LinkDocument';
import Modal from 'components/general/Modal';

const plugins = 'link lists table';

const toolbar =
  'styleselect | bold italic | markdownCode blockquote | bullist numlist | link table | privateKey copyPass linkDocument';

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
    this.onLinkButtonClick = this.onLinkButtonClick.bind(this);
    this.closeLinkDocumentModal = this.closeLinkDocumentModal.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.state = {
      showLinkDocumentModal: false
    };
  }

  setup(editor) {
    this.setState({ activeEditor: editor });
    editor.addButton('markdownCode', {
      icon: 'code',
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
      icon: 'lock',
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
    editor.addButton('copyPass', {
      icon: 'copy',
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
    editor.addButton('linkDocument', {
      icon: 'link',
      onclick: this.onLinkButtonClick
    });
  }

  onLinkButtonClick() {
    this.setState({
      showLinkDocumentModal: true
    });
  }

  closeLinkDocumentModal() {
    this.setState({
      showLinkDocumentModal: false
    });
  }

  handleEditorChange(content) {
    const { id, type } = this.props;
    this.props.onChange(id, content, type);
  }

  appendToDocFields(name, id) {
    this.state.activeEditor.insertContent(
      `<span class='document-link' data-id='${id}'>${name}</span>`
    );
    this.handleEditorChange();
    this.setState({
      showLinkDocumentModal: false
    });
  }

  render() {
    const linkDocumentModal = (
      <Modal
        show={this.state.showLinkDocumentModal}
        onClose={this.closeLinkDocumentModal}
      >
        <LinkDocument
          linkOnClick={(name, id) => {
            this.appendToDocFields(name, id);
          }}
          onClose={this.closeLinkDocumentModal}
        />
      </Modal>
    );

    return (
      <div>
        {this.state.showLinkDocumentModal && linkDocumentModal}
        <Editor
          initialValue={this.props.text}
          init={{
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
            content_css: '/css/index.css'
          }}
          onEditorChange={this.handleEditorChange}
        />
      </div>
    );
  }
}

export default RichText;
