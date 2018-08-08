import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import Modal from 'components/general/Modal';
import RichText from './RichText';

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
      showDeleteDialog: false,
      format: this.props.field.get('format'),
      id: this.props.field.get('id'),
      type: this.props.field.get('encrypted') ? 'encryptedText' : 'text'
    };
  }

  componentDidUpdate() {
    if (this.props.field.get('format') !== this.state.format) {
      this.props.onConvert(this.state.id, this.state.type, this.state.format);
    }
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

  toggleEditor() {
    this.setState({
      format: this.state.format === 'html' ? 'markdown' : 'html'
    });
  }

  render() {
    const {
      field,
      elementToHide,
      onChange,
      onRemoveField,
      connectDragSource,
      connectDropTarget
    } = this.props;

    const type = field.get('encrypted') ? 'encryptedText' : 'text';
    const textArea = (
      <textarea
        name={field.get('id')}
        onChange={event =>
          this.props.onChange(event.target.name, event.target.value, type)
        }
        value={field.get('value')}
      />
    );

    const richText = (
      <RichText
        id={field.get('id')}
        onChange={onChange}
        text={field.get('value')}
        type={type}
      />
    );

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
              {this.state.format === 'html' ? richText : textArea}
              <div className='toggle-editor'>
                <button
                  onClick={() => this.toggleEditor()}
                  type='button'
                  disabled={this.state.format === 'html'}
                >
                  Rich Text
                </button>
                <button
                  onClick={() => this.toggleEditor()}
                  type='button'
                  disabled={this.state.format === 'markdown'}
                >
                  Raw
                </button>
              </div>
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
