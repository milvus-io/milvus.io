import React from 'react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  RedditShareButton,
} from 'react-share';
import HackerNewsShareButton from './hackerNewsShareButton';
import { Helmet } from 'react-helmet';
import * as styles from './index.module.less';
import twitterIcon from '../../images/blog/twitter.svg';
import linkedinIcon from '../../images/blog/linkedin.svg';
import facebookIcon from '../../images/blog/facebook.svg';
import redditIcon from '../../images/blog/reddit.svg';
import hackernewsIcon from '../../images/blog/hackernews.svg';

const Share = props => {
  const { url, quote, desc, image, wrapperClass, vertical = false } = props;

  return (
    <div
      className={`${wrapperClass} ${styles.share}`}
      style={{ flexDirection: vertical ? 'column' : 'row' }}
    >
      <Helmet>
        <meta name="description" content={desc} />

        <meta property="og:title" content={quote}></meta>
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={quote} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={image} />
      </Helmet>
      <LinkedinShareButton url={url} title={quote}>
        <img src={linkedinIcon} alt="linkedin" className={styles.icon} />
      </LinkedinShareButton>
      <TwitterShareButton url={url} title={quote}>
        <img src={twitterIcon} alt="twitter" className={styles.icon} />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={quote}>
        <img src={facebookIcon} alt="facebook" className={styles.icon} />
      </FacebookShareButton>
      <RedditShareButton url={url} quote={quote}>
        <img src={redditIcon} alt="reddit" className={styles.icon} />
      </RedditShareButton>
      <HackerNewsShareButton url={url} title={quote}>
        <img src={hackernewsIcon} alt="hackernews" className={styles.icon} />
      </HackerNewsShareButton>
    </div>
  );
};

export default Share;
