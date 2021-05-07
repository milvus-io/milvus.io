import React from 'react';
// import './startCard.scss';
import * as styles from './startCard.module.css';
import standAloneIcon from '../../../images/doc-home/stand-alone.png';
import clusterIcon from '../../../images/doc-home/cluster.png';
import { useMobileScreen } from '../../../hooks/index';

const StartCard = ({ data, wrapperClass = '' }) => {
  const { title, link, key, btnLabel } = data;
  const { isMobile } = useMobileScreen();

  const imgMap = {
    'stand-alone': standAloneIcon,
    cluster: clusterIcon,
  };

  const imgSrc = imgMap[key.toLowerCase()];

  return (
    <div className={`${styles.cardWrapper} ${wrapperClass}`}>
      <div className={styles.textWrapper}>
        <img className={styles.cardImg} src={imgSrc} alt="icon" />
        <div className={styles.cardTitle}>{title}</div>
      </div>
      <div className={styles.btnWrapper}>
        <a href={link} className={styles.cardBtn}>
          <span className={styles.text}>{isMobile ? 'Learn' : btnLabel}</span>
          <span className={styles.icon}>
            <i className="fa fa-chevron-right"></i>
          </span>
        </a>
      </div>
    </div>
  );
};

export default StartCard;
