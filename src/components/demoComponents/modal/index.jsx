import React from 'react';
import * as styles from './index.module.less';

const Modal = ({
  open = false,
  className = '',
  children,
  handleCloseModal = () => {},
}) => {
  return (
    <div
      className={`${styles.modalWrapper} ${
        open ? styles.show : styles.hidden
      } ${className}`}
      onClick={handleCloseModal}
    >
      {children}
    </div>
  );
};

export default Modal;
