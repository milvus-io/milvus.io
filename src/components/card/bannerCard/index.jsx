import React from 'react';
import * as styles from './index.module.less';

const BannerCard = ({
  content = [],
  className = '',
  img,
}) => {

  return (
    <div className={`${styles.bannerCard} ${className}`}>
      <div className={styles.contentWrapper}>
        {
          content.map(item => (
            <p
              className={styles.text}
              key={item}
            >{item}</p>
          ))
        }
      </div>
      <div className={styles.bannerImg}>
        <img src={img} alt="banner" className={styles.img} />
      </div>
    </div>
  );
};

export default BannerCard;
