import React from 'react';
import './startCard.scss';
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
    <div className={`card-wrapper ${wrapperClass}`}>
      <div className="text-wrapper">
        <img className="card-img" src={imgSrc} alt="icon" />
        <div className="card-title">{title}</div>
      </div>
      <div className="btn-wrapper">
        <a href={link} className="card-btn">
          <span className="card-btn-text">{isMobile ? 'Learn' : btnLabel}</span>
          <span className="card-btn-icon">
            <i className="fa fa-chevron-right"></i>
          </span>
        </a>
      </div>
    </div>
  );
};

export default StartCard;
