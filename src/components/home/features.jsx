import React from 'react';

const HomeBanner = props => {
  const { t = v => v } = props;

  return (
    <section className="section2 col-12 col-8 col-4">
      <h2>{t('v3trans.home.feature.title')}</h2>
      <h5>{t('v3trans.home.feature.desc')}</h5>
      <ul className="features">
        <li>
          <img src="/images/home/cloud.svg" alt="cloud" />
          <h4>{t('v3trans.home.feature.cloud')}</h4>
          <p>{t('v3trans.home.feature.cloud-desc')}</p>
        </li>
        <li>
          <img src="/images/home/search.svg" alt="search" />
          <h4>{t('v3trans.home.feature.search')}</h4>
          <p>{t('v3trans.home.feature.search-desc')}</p>
        </li>
        <li>
          <img src="/images/home/command.svg" alt="command" />
          <h4>{t('v3trans.home.feature.devfirst')}</h4>
          <p>{t('v3trans.home.feature.devfirst-desc')}</p>
        </li>
      </ul>
    </section>
  );
};

export default HomeBanner;
