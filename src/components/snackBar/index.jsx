import React, { useEffect } from 'react';
import styles from './index.module.css';

export const CustomizedSnackbars = ({
  open,
  duration = 6000,
  handleClose = () => {},
  type = 'info',
  message = '',
}) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, handleClose]);

  if (!open) return null;

  return (
    <div className={`${styles.snackbar} ${styles[type] || ''}`}>
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={handleClose} aria-label="close">
        &times;
      </button>
    </div>
  );
};
