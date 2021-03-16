import React, { forwardRef } from 'react';
import './index.scss';

const MobilePopUp = forwardRef((props, ref) => {
  return <div className="pop-up-wrapper" ref={ref}>{props.children}</div>;
});
export default MobilePopUp