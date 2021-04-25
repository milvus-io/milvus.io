import React from 'react';
import './index.scss';

const V2Button = ({
  label,
  href,
  type,
  variant = 'contained',
  className = '',
}) => {
  return (
    <a
      href="#"
      className={`${
        variant === 'text' ? 'text' : 'contained'
      } v2_button ${className} `}
    >
      <span>{label}</span>
      <div className="icon-wrapper">
        <i
          className={`fa ${type === 'link' ? 'fa-chevron-right' : 'fa-pencil'}`}
        ></i>
      </div>
    </a>
  );
};

export default V2Button;
