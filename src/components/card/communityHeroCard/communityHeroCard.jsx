import React from 'react';
import githubIcon from '../../../images/community/github.png';
import slackIcon from '../../../images/community/slack.png';
import * as style from './communityHeroCard.module.less';

const CommunityHeroCard = ({
  data,
  wrapperClass = '',
  githubLabel,
  slackLabel,
}) => {
  const { title, link, desc, type } = data;

  const imgSrcMap = {
    SLACK: slackIcon,
    GITHUB: githubIcon,
  };

  const btnLabelMap = {
    SLACK: slackLabel,
    GITHUB: githubLabel,
  };

  return (
    <div className={`${style.wrapper} ${wrapperClass}`}>
      <div className={style.titleWrapper}>
        <img src={imgSrcMap[type]} alt="icon" />
        <h3>{title}</h3>
      </div>
      <p>{desc}</p>
      <div className={style.btnWrapper}>
        <a className={style.btn} href={link} target="_blank" rel="noreferrer">
          {btnLabelMap[type]}
          <i className={`fa fa-chevron-right ${style.icon}`}></i>
        </a>
      </div>
    </div>
  );
};

export default CommunityHeroCard;
