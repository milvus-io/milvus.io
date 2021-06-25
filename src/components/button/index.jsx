import React from 'react';
import LocalizedLink from '../localizedLink/localizedLink';
import * as styles from './index.module.less';

// type = 'link' || 'button'
// variant = 'text' | 'outline' | contained

const Button = ({
  link,
  variant = 'contained',
  className = '',
  children,
  locale
}) => {
  const reg = /^(http|https)/;
  const isExternal = reg.test(link);
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
        <LocalizedLink
          to={link}
          className={`${styles[variant]}`}
          locale={locale}
        >
          {children}
        </LocalizedLink>
      )}
    </div>
  );
};

export default Button;
