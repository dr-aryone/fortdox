import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import TurndownService from 'turndown';
var turndownPluginGfm = require('turndown-plugin-gfm');
var turndownService = new TurndownService();
var gfm = turndownPluginGfm.gfm;
var tables = turndownPluginGfm.tables;
var strikethrough = turndownPluginGfm.strikethrough;
var Remarkable = require('remarkable');
var md = new Remarkable();

turndownService.use(gfm);
turndownService.use([tables, strikethrough]);
turndownService.addRule('table', {
  filter: function(node) {
    return (
      node.firstChild.nodeName === 'TBODY' &&
      node.nodeName === 'TABLE' &&
      node.firstChild.firstChild.firstChild.nodeName === 'TD'
    );
  },
  replacement: function(content) {
    let divider = '';
    let table = content.split('\n');
    if (table[0] === '') table.shift();
    let [head, ...tail] = table;
    let header = head.split('|');
    for (let i = 0; i < header.length - 2; i++) {
      divider += '| --- ';
    }
    divider += '|';
    return head + '\n' + divider + '\n' + tail;
  }
});

const plugins = 'link image lists textpattern table';

const toolbar =
  'styleselect | bold italic underline | markdownCode blockquote | bullist numlist | link image table';

const formats = {
  codeMark: { inline: 'code' },
  blockquote: { block: 'blockquote' },
  underline: { block: 'u' }
};

const style_formats = [
  { title: 'Heading 1', block: 'h1' },
  { title: 'Heading 2', block: 'h2' },
  { title: 'Heading 3', block: 'h3' },
  { title: 'Heading 4', block: 'h4' },
  { title: 'Heading 5', block: 'h5' }
];

const textpattern_patterns = [
  { start: '*', end: '*', format: 'italic' },
  { start: '**', end: '**', format: 'bold' },
  { start: '#', format: 'h1' },
  { start: '##', format: 'h2' },
  { start: '###', format: 'h3' },
  { start: '####', format: 'h4' },
  { start: '#####', format: 'h5' },
  { start: '######', format: 'h6' },
  { start: '1. ', cmd: 'InsertOrderedList' },
  { start: '* ', cmd: 'InsertUnorderedList' },
  { start: '- ', cmd: 'InsertUnorderedList' }
];

class RichText extends Component {
  constructor(props) {
    super(props);

    this.setup = this.setup.bind(this);
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
  }

  handleEditorChange() {
    console.log(this.state.activeEditor.getContent());
    console.log(turndownService.turndown(this.state.activeEditor.getContent()));
  }

  render() {
    return (
      <Editor
        initialValue={md.render(`| bajs | bajs | bajs |
| --- | --- | --- |
| bajs | bajs | bajs |`)}
        init={{
          setup: this.setup,
          style_formats,
          formats,
          textpattern_patterns,
          plugins,
          toolbar,
          branding: false,
          menubar: false,
          target_list: false,
          link_title: false,
          entity_encoding: 'raw'
        }}
        onChange={e => this.handleEditorChange(e)}
      />
    );
  }
}

export default RichText;
