import React, { useEffect } from 'react';
import './index.scss';

const MobilePopUp = props => {
  const { className = "", open, hideMask } = props;
  useEffect(() => {
    const clickHandler = e => {
      const container = document.querySelector('.pop-up-wrapper');
      const btnContainer = document.querySelector('.menu-section');
      if (container) {
        const isInclude = Array.prototype.some.call([container, btnContainer], el => el.contains(e.target));
        if (!isInclude && container !== e.target) {
          hideMask();
        }
      }
    };

    window.addEventListener('click', e => clickHandler(e), false);
    return () => {
      window.removeEventListener('click', e => clickHandler(e), false);
    };
  }, [hideMask]);

  return <div className={`pop-up-wrapper ${className} ${open ? 'activited' : ''}`}>{props.children}</div>;
};
export default MobilePopUp;