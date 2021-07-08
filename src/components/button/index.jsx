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
  locale,
}) => {
  return (
    <div className={`${styles.buttonWrapper} ${className}`}>
      <LocalizedLink to={link} className={`${styles[variant]}`} locale={locale}>
        {children}
      </LocalizedLink>
    </div>
  );
};

export default Button;
