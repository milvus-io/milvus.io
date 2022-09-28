import React, { Ref, forwardRef } from 'react';
import ShareButton, {
  Props as ShareButtonProps,
} from 'react-share/lib/ShareButton';

function objectToGetParams(object) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return params.length > 0 ? `?${params.join('&')}` : '';
}

function createShareButton(networkName, link, optsMap, defaultProps) {
  function CreatedButton(props, ref) {
    const opts = optsMap(props);
    const passedProps = { ...props };

    // remove keys from passed props that are passed as opts
    const optsKeys = Object.keys(opts);
    optsKeys.forEach(key => {
      delete passedProps[key];
    });

    return (
      <ShareButton
        {...defaultProps}
        {...passedProps}
        forwardedRef={ref}
        networkName={networkName}
        networkLink={link}
        opts={optsMap(props)}
      />
    );
  }

  CreatedButton.displayName = `ShareButton-${networkName}`;

  return forwardRef(CreatedButton);
}

function hackerNewsLink(url, { title, via, hashtags = [], related = [] }) {
  return (
    'https://news.ycombinator.com/submitlink' +
    objectToGetParams({
      t: title,
      u: url,
    })
  );
}

const hackerNewsShareButton = createShareButton(
  'hackernews',
  hackerNewsLink,
  props => ({
    hashtags: props.hashtags,
    title: props.title,
    via: props.via,
    related: props.related,
  }),
  {
    windowWidth: 550,
    windowHeight: 400,
  }
);

export default hackerNewsShareButton;
