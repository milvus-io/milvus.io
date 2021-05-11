import React from 'react';
import * as styles from './index.module.less';

const MobilePopUp = props => {
  const { open } = props;
  console.log('---------- mobile pop up props', open);
  return (
    <div className={`${styles.popUpWrapper} ${open && styles.activited}`}>
      {props.children}
    </div>
  );
};
export default MobilePopUp;
