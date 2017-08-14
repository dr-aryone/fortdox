const React = require('react');

const Modal = ({children, onClose, show}) => {
  const clickHandler = event => {
    if (event.currentTarget === event.target) return onClose();
  };

  const modal = show ? (
    <div className='modal' onClick={clickHandler}>
      <div className='modal-inner'>
        <button className='close material-icons round small' onClick={onClose}>clear</button>
        {children}
      </div>
    </div>
  ) : null;

  return (
    modal
  );
};

module.exports = Modal;
