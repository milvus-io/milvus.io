import React, { useEffect, useState } from 'react';
import * as styles from './index.module.less';

const SnackBar = ({
  type = 'info',
  message = '',
  open,
  className = '',
  duration = 5000,
  handleCloseSnackBar = () => {},
}) => {
  const [timer, setTimer] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [leftTime, setLeftTime] = useState(0);

  const handleHover = () => {
    // stop counting and calculate left time
    if (timer) {
      clearTimeout(timer);
      const currentTime = new Date().getTime();
      setLeftTime(duration - (currentTime - startTime));
    }
  };

  const handleMouseLeave = () => {
    // keep counting
    if (open) {
      const timer = setTimeout(handleCloseSnackBar, leftTime);
      setTimer(timer);
    }
  };

  useEffect(() => {
    if (open) {
      setStartTime(new Date().getTime());
      const timer = setTimeout(handleCloseSnackBar, duration);
      setTimer(timer);
    }
  }, [open, handleCloseSnackBar, duration]);

  return (
    <div
      className={`${styles.snackBarWrapper} ${className} ${
        open ? styles.show : styles.hidden
      }`}
      onMouseEnter={handleHover}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex="-1"
    >
      <div className={`${styles[type]} ${styles.content}`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SnackBar;
