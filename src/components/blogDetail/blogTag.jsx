import React from 'react';
import * as styles from './index.module.less';

const BlogTag = ({ name, isActive, className = '' }) => (
  <span
    className={`${styles.tagWrapper} ${
      isActive ? styles.active : ''
    } ${className}`}
  >
    {name}
  </span>
);

export default BlogTag;
