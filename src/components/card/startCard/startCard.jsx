import React from 'react';
import * as styles from './startCard.module.less';
import standAloneIcon from '../../../images/doc-home/stand-alone.png';
import clusterIcon from '../../../images/doc-home/cluster.png';
import bootCamps from '../../../images/doc-home/bootcamps.png';
import { useMobileScreen } from '../../../hooks/index';

const StartCard = ({ data, wrapperClass = '' }) => {
  const { title, link, key, btnLabel } = data;
  const { isMobile } = useMobileScreen();

  const imgMap = {
    'stand-alone': standAloneIcon,
    cluster: clusterIcon,
    bootcamps: bootCamps
  };

  const imgSrc = imgMap[key.toLowerCase()];

  return (
    <div className={`${styles.cardWrapper} ${wrapperClass}`}>
      <div className={styles.textWrapper}>
        <img className={styles.img} src={imgSrc} alt="icon" />
        <div className={styles.title}>{title}</div>
      </div>
      <div className={styles.btnWrapper}>
        <a href={link} className={styles.btn}>
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
