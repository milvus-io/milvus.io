import React from 'react';
import Button from '../../button';
import { Link } from 'gatsby';
import * as styles from './index.module.less';

const DemoCard = ({ name, href, videoLink, desc, coverImg }) => {
  const handlePlayVideo = link => {
    console.log(link);
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.titleBar}>
        <p className={styles.title}>{name}</p>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.topSection}>
          <img src={coverImg} alt="" />
        </div>
        <div className={styles.bottomSection}>
          <p className={styles.description}>{desc}</p>
          <div className={styles.buttonWrapper}>
            <Button
              variant="text"
              className={styles.playBtn}
              children={
                <>
                  <i className="fas fa-play-circle"></i>
                  <span
                    className={styles.playBtnLabel}
                    onClick={() => handlePlayVideo(videoLink)}
                  >
                    Watch Demo
                  </span>
                </>
              }
            />
            <Button
              variant="contained"
              className={styles.tryBtn}
              link={href}
              children={
                <>
                  <span className={styles.tryBtnLabel}>Try Demo</span>
                  <i className="fa fa-chevron-right"></i>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoCard;
