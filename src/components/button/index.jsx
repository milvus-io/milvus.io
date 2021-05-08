import React from 'react';
import * as styles from './index.module.less';
// import './index.scss';

// type = 'link' || 'button'
// variant = 'text' | 'outline' | contained

const Button = ({
  href,
  type,
  isExternal = false,
  variant = 'contained',
  className = '',
  handleClick,
  children,
}) => {
  return (
    <div className={styles.buttonWrapper}>
      {type === 'link' ? (
        <a
          target={isExternal ? '_blank' : '_self'}
          rel="noopener noreferrer"
          href={href}
          className={`${styles[variant]} ${className}`}
        >
          {children}
        </a>
      ) : (
        <button
          onClick={handleClick}
          className={`${styles[variant]} ${className}`}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default Button;
