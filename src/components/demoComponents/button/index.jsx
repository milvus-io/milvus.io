import React from 'react';
import Link from 'next/link';
import * as styles from './index.module.less';

// type = 'link' || 'button'
// variant = 'text' | 'outline' | contained

const Button = ({
  link = '',
  variant = 'contained',
  className = '',
  children,
  locale = null,
  onClick = () => {},
  disabled = false,
  target = '_self',
}) => {
  return (
    <div className={`${styles.btnContainer} ${className}`}>
      {link ? (
        <Link
          href={link}
          className={`${styles[variant]} ${disabled ? styles.disabled : ''}`}
          disabled={disabled}
          target={target}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`${styles[variant]} ${styles.button} ${
            disabled ? styles.disabled : ''
          } `}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </div>
  );
};

export default Button;
