import React from 'react';
import classes from './index.module.less';
import pageClasses from '../../../styles/responsive.module.less';
import Marquee from 'react-fast-marquee';
import Bucket from '../bucket';
import { Typography } from '@mui/material';
import clsx from 'clsx';

const Msg = ({ label, link }) => {
  let isDesktop = true;
  if (typeof navigator !== 'undefined') {
    isDesktop =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
        navigator.userAgent
      );
  }

  const msg =
    link && label ? (
      <a href={link} className={classes.newsWrapper} target="_self">
        <Typography className={classes.newsTitle} component="span">
          News:&nbsp;
        </Typography>
        <Typography component="span" className={classes.newsContent}>
          🔥 {label}
        </Typography>
      </a>
    ) : null;

  return isDesktop ? (
    <div className={clsx(classes.msg, classes.desktopMsg)}>{msg}</div>
  ) : (
    <Marquee gradient={false} pauseOnHover={true} className={classes.msg}>
      {msg}
    </Marquee>
  );
};

const HomeBanner = props => {
  const { t = v => v, bannerData } = props;
  const { label, link } = bannerData || {};

  return (
    <div className={classes.banner}>
      <div className={classes.shootingStarContainer1}>
        <div className={classes.shootingStar}></div>
      </div>
      <div className={classes.shootingStarContainer2}>
        <div className={classes.shootingStar}></div>
      </div>
      <div
        className={clsx(
          pageClasses.col4,
          pageClasses.col8,
          pageClasses.col12,
          classes.bannerGridContainer
        )}
      >
        <div className={classes.leftSection}>
          <Msg label={label} link={link} />
          <h1 className={classes.title}>
            Vector database built for scalable <br />
            similarity search
          </h1>
          <p className={classes.subtitle}>{t('v3trans.home.banner.desc')}</p>

          <div className={classes.btnGroup}>
            <a
              className={classes.btnPrimary}
              href="https://cloud.zilliz.com/signup"
              target="_blank"
            >
              Try Managed Milvus
            </a>
            <a
              className={classes.btnStart}
              href="/docs/install_standalone-docker.md"
            >
              Try Open Source
            </a>
            <a
              className={classes.btnWatch}
              href="https://www.youtube.com/watch?v=nQkmgCtVz5k"
              target="_blank"
              rel="noreferrer noopener"
            >
              Watch Video
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
        <div className={clsx(classes.bucket, classes.bucketContainer)}>
          <Bucket />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
