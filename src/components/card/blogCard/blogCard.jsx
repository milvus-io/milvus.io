import React from 'react';
import * as styles from './blogCard.module.less';
import { useMobileScreen } from '../../../hooks/index';

const BlogCard = ({ data, wrapperClass = '' }) => {
  const { title, abstract, imgSrc, time } = data;
  const { isMobile } = useMobileScreen();

  return (
    <div className={`${styles.blogWrapper} ${wrapperClass}`}>
      <div className={styles.content}>
        <p className={styles.time}>{time}</p>
        <h2>{title}</h2>
        <p className={styles.abstract}>{abstract}</p>
      </div>
      {!isMobile && <img src={imgSrc} alt="blog" />}
    </div>
  );
};

export default BlogCard;
