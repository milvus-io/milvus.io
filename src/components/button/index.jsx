import React from 'react';
import LocalizedLink from '../localizedLink/localizedLink';
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
        link.includes('#') || !locale ? (
          <a
            href={link}
            className={`${styles[variant]} ${disabled ? styles.disabled : ''}`}
            target={target}
            disabled={disabled}
          >
            {children}
          </a>
        ) : (
          <LocalizedLink
            to={link}
            className={`${styles[variant]} ${disabled ? styles.disabled : ''}`}
            locale={locale}
            disabled={disabled}
          >
            {children}
          </LocalizedLink>
        )
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
