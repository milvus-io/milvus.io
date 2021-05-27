import React from 'react';
import * as styles from './index.module.less';

const BannerCard = ({
  title,
  content = '',
  children,
  className = '',
  img
}) => {

  return (
    <div className={`${styles.bannerCard} ${className}`}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{title}</h1>
        {
          !!content.length ? (
            <p className={styles.text}>{content}</p>
          ) : children
        }
      </div>
      <div className={styles.bannerImg}>
        <img src={img} alt="banner image" className={styles.img} />
      </div>
    </div>
  );

};

export default BannerCard;