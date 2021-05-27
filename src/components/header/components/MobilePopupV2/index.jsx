import React, { useEffect } from 'react';
import * as styles from './index.module.less';
import { useMobileScreen } from '../../../../hooks';

const MobilePopUp = props => {
  const { className = '', open, hideMask } = props;

  return (
    <>
      <div
        className={`${styles.popUpWrapper} ${className} ${open ? styles.activited : ''
          }`}
      >
        {props.children}
      </div>
      <div
        tabIndex="0"
        role="button"
        aria-label="dialog mask"
        onClick={hideMask}
        onKeyDown={hideMask}
        className={open ? styles.mask : styles.hidden}
      ></div>
    </>
  );
};
export default MobilePopUp;
