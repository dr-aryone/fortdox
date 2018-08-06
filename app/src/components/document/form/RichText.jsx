import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import LinkDocument from './LinkDocument';
import Modal from 'components/general/Modal';
import TurndownService from 'turndown';
import {
  tableRule,
  privateKeyRule,
  copyRule,
  documentLinkRule
} from 'lib/turndownExtensions';
const turndownPluginGfm = require('turndown-plugin-gfm');
const turndownService = new TurndownService({
  emDelimiter: '*',
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});
const gfm = turndownPluginGfm.gfm;
const tables = turndownPluginGfm.tables;
turndownService.use(gfm);
turndownService.use([tables]);
turndownService.addRule('table', tableRule);
turndownService.addRule('privateKey', privateKeyRule);
turndownService.addRule('copy', copyRule);
turndownService.addRule('documentLink', documentLinkRule);

const Remarkable = require('remarkable');
const {
  privateKeyParser,
  copyParser,
  documentLinkParser,
  privateKeyRenderer,
  copyRenderer,
  documentLinkRenderer
} = require('lib/remarkableExtensions');
const md = new Remarkable();
md.block.ruler.before('code', 'privatekey', privateKeyParser);
md.inline.ruler.push('copy', copyParser);
md.inline.ruler.push('documentLink', documentLinkParser);
md.renderer.rules.privatekey = privateKeyRenderer;
md.renderer.rules.copy = copyRenderer;
md.renderer.rules.documentLink = documentLinkRenderer;

const plugins = 'lists table';

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
    this.onLinkDocumentButtonClick = this.onLinkDocumentButtonClick.bind(this);
    this.onCloseLinkDocumentModal = this.onCloseLinkDocumentModal.bind(this);
    this.onLinkButtonClick = this.onLinkButtonClick.bind(this);
    this.onCloseLinkModal = this.onCloseLinkModal.bind(this);

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
      onclick: this.onLinkDocumentButtonClick
    });

    editor.addButton('link', {
      icon: 'link',
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

  handleEditorChange() {
    const { id, type } = this.props;
    const text = turndownService.turndown(this.state.activeEditor.getContent());
    this.props.onRichTextChange(id, text, type);
  }

  appendDocumentLink(name, id) {
    this.state.activeEditor.insertContent(
      `<span class='document-link' data-id='${id}'>${name}</span>`
    );
    this.handleEditorChange();
    this.setState({
      showLinkDocumentModal: false
    });
  }

  appendLink() {
    let url = this.state.url;
    let urlText = this.state.urlText;
    this.state.activeEditor.insertContent(`<a href='${url}'>${urlText}</a>`);
    this.handleEditorChange();
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
          initialValue={md.render(this.props.text)}
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
          onKeyUp={() => this.handleEditorChange()}
        />
      </div>
    );
  }
}

export default RichText;
