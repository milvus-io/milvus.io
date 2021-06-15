import React from 'react';
import * as styles from './index.module.less';

const BannerCard = ({
  content = [],
  title = "",
  className = '',
  isMobile = false,
  img,
}) => {

  return (
    <div className={`${styles.bannerCard} ${className}`}>
      {
        !isMobile ? (
          <>
            <div className={styles.contentWrapper}>
              <h1 className={styles.title}>{title}</h1>
              <div>
                {
                  content.map(item => (
                    <p
                      className={styles.text}
                      key={item}
                    >{item}</p>
                  ))
                }
              </div>
            </div>
            <div className={styles.bannerImg}>
              <img src={img} alt="banner" className={styles.img} />
            </div>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.bannerImg}>
              <img src={img} alt="banner" className={styles.img} />
            </div>
            <div>
              {
                content.map(item => (
                  <p
                    className={styles.text}
                    key={item}
                  >{item}</p>
                ))
              }
            </div>
          </>
        )
      }

    </div>
  );
};

export default BannerCard;
