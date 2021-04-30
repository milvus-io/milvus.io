import React from 'react';
import './index.scss';

const MobilePopUp = props => {
  const { className = "", open } = props;

  return <div className={`pop-up-wrapper ${className} ${open ? 'activited' : ''}`}>{props.children}</div>;
};
export default MobilePopUp;