import React from 'react';
import * as styles from './blogCard.module.less';
import { useMobileScreen } from '../../../hooks/index';
import LocalizedLink from '../.././../components/localizedLink/localizedLink';

const BlogCard = ({ data, wrapperClass = '' }) => {
  const { title, abstract, imgSrc, time, link, locale } = data;
  const { isMobile } = useMobileScreen();

  return (
    <LocalizedLink
      className={`${styles.blogWrapper} ${wrapperClass}`}
      to={link}
      locale={locale}
    >
      <div className={styles.content}>
        <p className={styles.time}>{time}</p>
        <h2>{title}</h2>
        <p className={styles.abstract}>{abstract}</p>
      </div>
      {!isMobile && (
        <div
          className={styles.imgWrapper}
          style={{ backgroundImage: `url(${imgSrc})` }}
        ></div>
      )}
    </LocalizedLink>
  );
};

export default BlogCard;
