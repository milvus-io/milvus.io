import React from 'react';
import * as styles from './index.module.less';
import github from '../../../images/milvus-demos/github.png';
import forum from '../../../images/milvus-demos/forum.png';
import Button from '../../button';

const FloatBord = () => {
  return (
    <div className={styles.floatBordContainer}>
      <div className={styles.linkItem}>
        <p className={styles.desc}>Dive into the source code.</p>
        <Button
          link="https://bit.ly/3Ct2dKo"
          variant="outline"
          className={`${styles.linkBtn} ${styles.whiteBtn}`}
          children={
            <div className={styles.content}>
              <img src={github} alt="github" />
              <span>Github</span>
              <i className="fas fa-chevron-right"></i>
            </div>
          }
        />
      </div>

      <div className={styles.linkItem}>
        <p className={styles.desc}>Primary technical support channel.</p>
        <Button
          link="https://bit.ly/3H7KOuu"
          className={styles.linkBtn}
          variant="contained"
          children={
            <div className={styles.content}>
              <img src={forum} alt="forum" />
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
