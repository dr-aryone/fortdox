const React = require('react');

const Modal = ({children, onClose, show}) => {
  const clickHandler = event => {
    if (event.currentTarget === event.target) return onClose();
  };

  const modal = show ? (
    <div className='modal' onClick={clickHandler}>
      <div className='modal-inner'>
        <span className='close'>
          <i className='material-icons' onClick={onClose}>
            clear
          </i>
        </span>
        {children}
      </div>
    </div>
  ) : null;

  return (
    modal
  );
};

module.exports = Modal;
