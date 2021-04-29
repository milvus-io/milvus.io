import React from 'react';
import './startCard.scss';
import standAloneIcon from '../../../images/doc-home/stand-alone.png';
import clusterIcon from '../../../images/doc-home/cluster.png';

const StartCard = ({ data, wrapperClass = '' }) => {
  const { title, link, key, btnLabel } = data;
  const imgMap = {
    'stand-alone': standAloneIcon,
    cluster: clusterIcon,
  };

  const imgSrc = imgMap[key.toLowerCase()];

  return (
    <div className={`card-wrapper ${wrapperClass}`}>
      <img className="card-img" src={imgSrc} alt="icon" />
      <div className="card-title">{title}</div>
      <a href={link} className="card-btn">
        <span className="card-btn-text">{btnLabel}</span>
        <span className="card-btn-icon">
          <i className="fa fa-chevron-right"></i>
        </span>
      </a>
    </div>
  );
};

export default StartCard;
