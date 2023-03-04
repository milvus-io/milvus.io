import React from 'react';
import './banner.less';
import { Link } from 'gatsby-plugin-react-i18next';
import Marquee from 'react-fast-marquee';
import Bucket from './bucket';
import { Typography } from '@mui/material';

const Msg = () => {
  let isDesktop = true;
  if (typeof navigator !== 'undefined') {
    isDesktop =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
      );
  }

  const msg = (
    <a href="https://zilliz.com/whitepaper" className="news-wrapper">
      <Typography className="news-title" component="span">
        News:&nbsp;
      </Typography>
      <Typography component="span" className="news-content">
        🔥 Milvus 2.2 is released, up to 200% performance gain! Learn More
        &#8594;
      </Typography>
    </a>
  );

  return isDesktop ? (
    <div className="msg desktop-msg">{msg}</div>
  ) : (
    <Marquee gradient={false} pauseOnHover={true} className="msg">
      {msg}
    </Marquee>
  );
};

const HomeBanner = props => {
  const { t = v => v } = props;
  return (
    <div className="banner">
      <div className="shooting_star_container1">
        <div className="shooting_star"></div>
      </div>
      <div className="shooting_star_container2">
        <div className="shooting_star"></div>
      </div>
      <div className="banner-grid-container col-12 col-8 col-4">
        <div className="title-wrapper">
          <Msg />
          <h1 className="title">Vector database built for scalable <br />similarity search</h1>
          <p className="subtitle">{t('v3trans.home.banner.desc')}</p>
          <div className="bucket bucket-container">
            <Bucket />
          </div>
          <div className="btn-group">
            <Link
              className="btn-start"
              to={`/docs/install_standalone-docker.md`}
            >
              {t('v3trans.home.banner.getstart')}
            </Link>
            <a
              className="btn-watch"
              href="https://www.youtube.com/watch?v=nQkmgCtVz5k"
              target="_blank"
              rel="noreferrer noopener"
            >
              {t('v3trans.home.banner.watch')}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m10 16.5 6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="white"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
