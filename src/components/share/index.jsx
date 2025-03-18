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
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content={url} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={quote} />
        <meta name="twitter:description" content={desc} />
        {image && <meta name="twitter:image" content={image} />}
      </Helmet>
      <LinkedinShareButton url={url} title={quote}>
        <img
          src="/images/blog/linkedin.svg"
          alt="linkedin"
          className={styles.icon}
        />
      </LinkedinShareButton>
      <TwitterShareButton url={url} title={quote}>
        <img
          src="/images/blog/twitter.svg"
          alt="twitter"
          className={styles.icon}
        />
      </TwitterShareButton>
      <FacebookShareButton url={url} quote={quote}>
        <img
          src="/images/blog/facebook.svg"
          alt="facebook"
          className={styles.icon}
        />
      </FacebookShareButton>
      <RedditShareButton url={url} quote={quote}>
        <img
          src="/images/blog/reddit.svg"
          alt="reddit"
          className={styles.icon}
        />
      </RedditShareButton>
      <HackerNewsShareButton url={url} title={quote}>
        <img
          src="/images/blog/hackernews.svg"
          alt="hackernews"
          className={styles.icon}
        />
      </HackerNewsShareButton>
    </div>
  );
};

export default Share;
