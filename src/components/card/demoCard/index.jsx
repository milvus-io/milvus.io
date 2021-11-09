import React from 'react';
import Button from '../../button';
import { Link } from 'gatsby';
import * as styles from './index.module.less';

const DemoCard = ({
  name,
  href,
  videoLink,
  desc,
  coverImg,
  className = '',
  handlePlayVideo = () => {},
  handleTryDemo = () => {},
}) => {
  return (
    <div className={`${styles.cardContainer} ${className}`}>
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
              onClick={() => handlePlayVideo(videoLink)}
              variant="text"
              className={styles.playBtn}
              children={
                <>
                  <i className="fas fa-play-circle"></i>
                  <span className={styles.playBtnLabel}>Watch Demo</span>
                </>
              }
            />
            <Button
              onClick={() =>
                handleTryDemo({
                  name,
                  href,
                })
              }
              variant="contained"
              className={styles.tryBtn}
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
