import React from 'react';
import * as styles from './index.module.css';

const SHARE_CONFIGS = [
  {
    name: 'linkedin',
    icon: '/images/blog/linkedin.svg',
    getUrl: ({ url, quote }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(quote || '')}`,
  },
  {
    name: 'twitter',
    icon: '/images/blog/twitter.svg',
    getUrl: ({ url, quote }) =>
      `https://twitter.com/share?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(quote || '')}`,
  },
  {
    name: 'facebook',
    icon: '/images/blog/facebook.svg',
    getUrl: ({ url }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'reddit',
    icon: '/images/blog/reddit.svg',
    getUrl: ({ url, quote }) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(quote || '')}`,
  },
  {
    name: 'hackernews',
    icon: '/images/blog/hackernews.svg',
    getUrl: ({ url, quote }) =>
      `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(
        url
      )}&t=${encodeURIComponent(quote || '')}`,
  },
];

const Share = props => {
  const { url, quote, wrapperClass, vertical = false } = props;

  return (
    <div
      className={`${wrapperClass} ${styles.share}`}
      style={{ flexDirection: vertical ? 'column' : 'row' }}
    >
      {SHARE_CONFIGS.map(config => (
        <a
          key={config.name}
          href={config.getUrl({ url, quote })}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${config.name}`}
        >
          <img src={config.icon} alt={config.name} className={styles.icon} />
        </a>
      ))}
    </div>
  );
};

export default Share;
