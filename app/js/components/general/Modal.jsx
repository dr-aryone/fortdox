const React = require('react');

const Modal = ({children, onClose, show, showClose, docMode}) => {
  const clickHandler = event => {
    if (event.currentTarget === event.target) return onClose();
  };

  const closeButton = showClose ?
    (<button className='close material-icons round small' onClick={onClose}>clear</button>)
    : null;

  const modal = show ? (
    <div className={`modal ${docMode ? 'doc-mode' : ''}`} onClick={clickHandler}>
      <div className='modal-inner'>
        {closeButton}
        {children}
      </div>
    </div>
  ) : null;

  return (
    modal
  );
};

module.exports = Modal;
