import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';

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
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

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
    this.props = props;
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

    const style = {
      minHeight: `${field.get('value').split('\n').length}em`
    };

    const opacity = field.get('id') === elementToHide ? 0 : 1;

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
            <label>
              <h3>{field.get('label')}</h3>
              <i
                className='material-icons'
                onClick={() => onRemoveField(field.get('id'))}
              >
                delete
              </i>
            </label>
            <div className='textarea'>
              <textarea
                name={field.get('id')}
                onChange={event => onChange(event, type)}
                value={field.get('value')}
                style={style}
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
