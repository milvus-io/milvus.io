import React from 'react';
import { Link } from 'gatsby';
import locales from '../../consts/locales.js';
import * as styles from './localizedLink.module.less';

const LocalizedLink = ({ locale, to, children, className = '' }) => {
  const language = locales[locale];
  const toMedium = locale === 'en' && to.includes('blog');
  if (toMedium) {
    return (
      <a
        href="https://medium.com/tag/milvus-project/latest"
        target="_blank"
        rel="noopener noreferrer"
        children={children}
        aria-label="Milvus Blog"
        className={`${styles.link} ${className}`}
      ></a>
    );
  }

  let path;

  language && !language.default ? (path = `/${locale}${to}`) : (path = to);
  return (
    <Link
      className={`${styles.link} ${className}`}
      children={children}
      to={path}
    />
  );
};

export default LocalizedLink;
