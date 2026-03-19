import React from 'react';
import * as styles from './index.module.css';

const Loading = ({ msg = 'Loading....' }) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.iconWrapper}>
        <i className="fas fa-spinner"></i>
      </div>

      {msg}
    </div>
  );
};

export default Loading;
