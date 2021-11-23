import React from 'react';
import * as styles from './index.module.less';

const BlogTag = ({ name, className = '' }) => (
  <span className={`${styles.tagWrapper} ${className}`}>{name}</span>
);

export default BlogTag;
