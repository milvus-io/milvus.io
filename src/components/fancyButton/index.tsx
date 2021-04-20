import React, { useRef } from 'react';
import './index.scss';

const FancyButton = props => {
  const {
    text = 'Button',
    className,
    children,
    icon,
    disabled = false,
  } = props;

  const btnRef = useRef(null);

  const handleClick = e => {
    const { width, height } = window.getComputedStyle(btnRef.current);
    const { offsetLeft, offsetTop } = btnRef.current;

    const { clientX, clientY } = e;

    const docWrapper = document.getElementsByClassName('doc-wrapper')[0];
    let docWidth = 0;
    if (docWrapper) {
      docWidth = parseInt(window.getComputedStyle(docWrapper).width);
    }

    const { innerWidth } = window;
    const distanceLeft = (innerWidth - docWidth) / 2 + 250;
    const pointInBtn_x = clientX - distanceLeft - offsetLeft
    const pointInBtn_y = clientY - offsetTop - 60
  };

  return (
    <div
      className="fancy-button-wrapper"
      ref={btnRef}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <div
        className={`${className ? className : ''} ${
          disabled ? 'disabled' : ''
        } button-container`}
      >
        {icon && (
          <p className="icon-wrapper">
            <img src={icon} alt="button-icon" />
          </p>
        )}

        <p className="text">{text ? <span>{text}</span> : children}</p>
      </div>
    </div>
  );
};

export default FancyButton;
