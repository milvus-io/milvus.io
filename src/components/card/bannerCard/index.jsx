import React from "react";
import * as styles from "./index.module.less";

const BannerCard = ({ content = [], title = "", className = "" }) => {
  return (
    <div className={`${styles.bannerCard} ${className}`}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>{title}</h1>
        {content.map(item => (
          <p className={styles.text} key={item}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BannerCard;
