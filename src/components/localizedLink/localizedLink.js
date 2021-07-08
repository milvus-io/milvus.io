import React from 'react';
import { Link } from 'gatsby';
import locales from '../../consts/locales.js';
import * as styles from './localizedLink.module.less';

const LocalizedLink = ({ locale, to, children, className = '' }) => {
  const language = locales[locale];
  const reg = /^(http|https)/;
  const isExternal = reg.test(to);
  if (isExternal) {
    return (
      <a
        target="_blank"
        href={to}
        rel="noopener noreferrer"
        className={`${styles.link} ${className}`}
      >
        {children}
      </a>
    );
  }

  let path;

  const title = typeof children === 'string';

  language && !language.default ? (path = `/${locale}${to}`) : (path = to);
  return title ? (
    <Link
      className={`${styles.link} ${className}`}
      children={children}
      to={path}
      title={children}
    />
  ) : (
    <Link
      className={`${styles.link} ${className}`}
      children={children}
      to={path}
    />
  );
};

export default LocalizedLink;
