import React from 'react';
import './index.scss';

// type = 'link' || 'button'
// variant = 'text' | 'outline' | contained

const V2Button = ({
  href,
  type,
  isExternal = false,
  variant = 'contained',
  className = '',
  handleClick,
  children
}) => {
  return (
    <div className="button-wrapper">
      {
        type === 'link' ? (
          <a
            target={isExternal ? '_blank' : '_self'}
            rel="noopener noreferrer"
            href={href}
            className={`${variant === 'text' ? 'text' : variant === 'outline' ? 'outline' : 'contained'
              } ${className}`}
          >
            {
              children
            }
          </a>
        ) : (
          <button onClick={handleClick} className={`${variant === 'text' ? 'text' : variant === 'outline' ? 'outline' : 'contained'
            } ${className}`}>
            {
              children
            }
          </button>
        )
      }
    </div>
  );
};

export default V2Button;
