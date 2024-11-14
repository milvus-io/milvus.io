import React from 'react';
import styles from './index.module.less';
import Button from '../button';
import { Forum } from '../item/searchIcon';

const FloatBord = ({ className = '' }) => {
  return (
    <div className={`${styles.floatBordContainer} ${className}`}>
      <div className={styles.linkItem}>
        <p className={styles.desc}>Dive into the source code.</p>
        <Button
          link="https://github.com/milvus-io/bootcamp/tree/master/bootcamp/tutorials/quickstart/apps/image_search_with_milvus"
          variant="outline"
          className={`${styles.linkBtn} ${styles.whiteBtn}`}
          target="_blank"
          children={
            <div className={styles.content}>
              <img src="/images/demos/github.svg" alt="github" />
              <span>Github</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          }
        />
      </div>

      <div className={styles.linkItem}>
        <p className={styles.desc}>Primary technical support channel.</p>
        <Button
          link="https://discord.com/invite/8uyFbECzPX"
          className={styles.linkBtn}
          target="_blank"
          variant="contained"
          children={
            <div className={styles.content}>
              <Forum />
              <span>Forum</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default FloatBord;
