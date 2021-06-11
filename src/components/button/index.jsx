import React from 'react';
import { Link } from 'gatsby';
import * as styles from './index.module.less';

// type = 'link' || 'button'
// variant = 'text' | 'outline' | contained

const Button = ({
  link,
  isExternal = false,
  variant = 'contained',
  className = '',
  children,
}) => {
  return (
    <div className={`${styles.buttonWrapper} ${className}`}>
      {isExternal ? (
        <a
          target='_blank'
          rel="noopener noreferrer"
          href={link}
          className={`${styles[variant]}`}
        >
          {children}
        </a>
      ) : (
        <Link
          to={link}
          className={`${styles[variant]}`}
        >
          {children}
        </Link>
      )}
    </div>
  );
};

export default Button;
