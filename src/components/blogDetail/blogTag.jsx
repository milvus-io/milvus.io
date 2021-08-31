import React from 'react';
import * as styles from './index.module.less';

const BlogTag = ({ name, isActive, classname = '' }) => (
  <span
    className={`${styles.tagWrapper} ${
      isActive ? styles.active : ''
    } ${classname}`}
  >
    {name}
  </span>
);

export default BlogTag;
