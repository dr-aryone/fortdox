import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import Modal from 'components/general/Modal';
import { Editor } from '@tinymce/tinymce-react';
import TurndownService from 'turndown';
var turndownService = new TurndownService();
// Import plugins from turndown-plugin-gfm
var turndownPluginGfm = require('turndown-plugin-gfm');
var gfm = turndownPluginGfm.gfm;
var tables = turndownPluginGfm.tables;
var strikethrough = turndownPluginGfm.strikethrough;

// Use the gfm plugin
turndownService.use(gfm);

// Use the table and strikethrough plugins only
turndownService.use([tables, strikethrough]);
const Type = {
  TEXT: 'text'
};

const textSource = {
  beginDrag(props) {
    return {
      index: props.field.get('id')
    };
  }
};

const textTarget = {
  hover(props, monitor, component: TextArea | null) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.field.get('id');

    if (!component) return null;
    if (dragIndex === hoverIndex) return;

    const rawComponent = component.getDecoratedComponentInstance();
    const hoverBoundingRect = rawComponent.node.getBoundingClientRect();
    const breakPoint = (hoverBoundingRect.bottom - hoverBoundingRect.top) * 0.3;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY =
      dragIndex < hoverIndex
        ? clientOffset.y - hoverBoundingRect.top
        : hoverBoundingRect.bottom - clientOffset.y;

    if (hoverClientY < breakPoint) return;

    props.onUpdateId(dragIndex, hoverIndex);
    props.onHideElement(hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
  drop(props) {
    props.onDrop();
  }
};

class TextArea extends Component {
  constructor(props) {
    super(props);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.state = {
      showDeleteDialog: false
    };
  }

  onDeleteField(field) {
    if (field.get('value').trim() === '')
      return this.props.onRemoveField(field.get('id'));

    this.setState({
      showDeleteDialog: true
    });
  }

  closeDeleteDialog() {
    this.setState({
      showDeleteDialog: false
    });
  }

  handleEditorChange(e) {
    console.log(this.state.activeEditor.getContent());
    console.log(turndownService.turndown(this.state.activeEditor.getContent()));
  }

  render() {
    const {
      field,
      type,
      elementToHide,
      onChange,
      onRemoveField,
      connectDragSource,
      connectDropTarget
    } = this.props;

    // const style = {
    //   minHeight: `${field.get('value').split('\n').length}em`
    // };

    const opacity = field.get('id') === elementToHide ? 0 : 1;

    const deleteDialog = (
      <Modal
        show={this.state.showDeleteDialog}
        onClose={this.closeDeleteDialog}
        showClose={false}
      >
        <div className='box dialog danger'>
          <i className='material-icons'>error_outline</i>
          <h2>Warning</h2>
          <p>Are you sure you want to delete this text field?</p>
          <div className='buttons'>
            <button onClick={this.closeDeleteDialog} type='button'>
              Cancel
            </button>
            <button
              onClick={() => onRemoveField(field.get('id'))}
              type='button'
              className='warning'
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    );

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div
            className={`input-field grab-cursor ${
              field.get('error') ? 'warning' : ''
            }`}
            style={{ opacity }}
            ref={node => (this.node = node)}
          >
            {this.state.showDeleteDialog && deleteDialog}
            <label>
              <h3>{field.get('label')}</h3>
              <i
                className='material-icons'
                onClick={() => this.onDeleteField(field)}
              >
                delete
              </i>
            </label>
            <div className='textarea'>
              <Editor
                initialValue=''
                init={{
                  setup: editor => {
                    this.setState({ activeEditor: editor });
                    editor.addButton('markdownCode', {
                      icon: 'code',
                      onclick: function() {
                        editor.execCommand(
                          'mceToggleFormat',
                          false,
                          'codeMark'
                        );
                      },
                      onpostrender: function() {
                        var btn = this;
                        editor.on('init', function() {
                          editor.formatter.formatChanged('codeMark', function(
                            state
                          ) {
                            btn.active(state);
                          });
                        });
                      }
                    });
                  },
                  style_formats: [
                    { title: 'Heading 1', block: 'h1' },
                    { title: 'Heading 2', block: 'h2' },
                    { title: 'Heading 3', block: 'h3' },
                    { title: 'Heading 4', block: 'h4' },
                    { title: 'Heading 5', block: 'h5' }
                  ],
                  formats: {
                    codeMark: { inline: 'code' },
                    blockquote: { block: 'blockquote' },
                    underline: { block: 'u' }
                  },
                  plugins: 'link image lists textpattern table',
                  toolbar:
                    'styleselect | bold italic underline | markdownCode blockquote | bullist numlist | link image table',
                  branding: false,
                  menubar: false,
                  textpattern_patterns: [
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
                  ],
                  target_list: false,
                  link_title: false,
                  entity_encoding: 'raw'
                }}
                onChange={e => this.handleEditorChange(e)}
              />
            </div>
            <div className={`arrow-box ${field.get('error') ? 'show' : ''}`}>
              <span className='material-icons'>error_outline</span>
              {field.get('error')}
            </div>
          </div>
        )
      )
    );
  }
}

export default flow(
  DragSource(
    Type.TEXT,
    textSource,
    (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  ),
  DropTarget(Type.TEXT, textTarget, (connect: DropTargetConnector) => ({
    connectDropTarget: connect.dropTarget()
  }))
)(TextArea);
