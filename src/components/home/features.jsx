import React from 'react';
import CloudIcon from '../../images/home/cloud.svg';
import RichIcon from '../../images/home/rich.svg';
import EasyIcon from '../../images/home/easy.svg';
import ScaleIcon from '../../images/home/scale.svg';
import CostIcon from '../../images/home/cost.svg';
import FastIcon from '../../images/home/fast.svg';

const HomeBanner = props => {
  const { t = v => v } = props;

  return (
    <section className="section2 col-12 col-8 col-4">
      <h2>{t('v3trans.home.feature.title')}</h2>
      <h5>{t('v3trans.home.feature.desc')}</h5>
      <ul className="features">
        <li>
          <img src={EasyIcon} alt={t('v3trans.home.feature.easy')} />
          <h4>{t('v3trans.home.feature.easy.title')}</h4>
          <p>{t('v3trans.home.feature.easy.desc')}</p>
        </li>
        <li>
          <img src={FastIcon} alt={t('v3trans.home.feature.fast')} />
          <h4>{t('v3trans.home.feature.fast.title')}</h4>
          <p>{t('v3trans.home.feature.fast.desc')}</p>
        </li>
        <li>
          <img src={ScaleIcon} alt={t('v3trans.home.feature.scale')} />
          <h4>{t('v3trans.home.feature.available.title')}</h4>
          <p>{t('v3trans.home.feature.available.desc')}</p>
        </li>
        <li>
          <img src={CostIcon} alt={t('v3trans.home.feature.cost')} />
          <h4>{t('v3trans.home.feature.scalable.title')}</h4>
          <p>{t('v3trans.home.feature.scalable.desc')}</p>
        </li>
        <li>
          <img src={CloudIcon} alt={t('v3trans.home.feature.cloud')} />
          <h4>{t('v3trans.home.feature.cloud.title')}</h4>
          <p>{t('v3trans.home.feature.cloud.desc')}</p>
        </li>

        <li>
          <img src={RichIcon} alt={t('v3trans.home.feature.rich')} />
          <h4>{t('v3trans.home.feature.rich.title')}</h4>
          <p>{t('v3trans.home.feature.rich.desc')}</p>
        </li>
      </ul>
    </section>
  );
};

export default HomeBanner;
