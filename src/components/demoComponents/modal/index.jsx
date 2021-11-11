import React from 'react';
import * as styles from './index.module.less';

const Modal = ({
  open = false,
  className = '',
  component: CustomComponent = () => <></>,
  handleCloseModal = () => {},
}) => {
  const handleClickContainer = e => {
    if (e.target !== e.currentTarget) {
      return;
    }
    handleCloseModal();
  };

  return (
    <div
      className={`${styles.modalWrapper} ${
        open ? styles.show : styles.hidden
      } ${className}`}
      onClick={handleClickContainer}
      role="button"
      tabIndex="-1"
      onKeyDown={handleClickContainer}
    >
      <CustomComponent />
    </div>
  );
};

export default Modal;
