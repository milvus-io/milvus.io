// import assert from './utils/assert';
// import objectToGetParams from './utils/objectToGetParams';
// import createShareButton from './hocs/createShareButton';

class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
  }
}

function assert(value: any, message: string) {
  if (!value) {
    throw new AssertionError(message);
  }
}

function objectToGetParams (object: {
  [key: string]: string | number | undefined | null;
}) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
}

import React, { Ref, forwardRef } from 'react';

import ShareButton, { Props as ShareButtonProps } from 'react-share/lib/ShareButton';

function createShareButton<OptionProps extends Record<string, any>, LinkOptions = OptionProps>(
  networkName: string,
  link: (url: string, options: LinkOptions) => string,
  optsMap: (props: OptionProps) => LinkOptions,
  defaultProps: Partial<ShareButtonProps<LinkOptions> & OptionProps>,
) {
  type Props = Omit<
    ShareButtonProps<LinkOptions>,
    'forwardedRef' | 'networkName' | 'networkLink' | 'opts'
  > &
    OptionProps;
  
  console.log();

  function CreatedButton(props: Props, ref: Ref<HTMLButtonElement>) {
    const opts = optsMap(props);
    const passedProps = { ...props };

    // remove keys from passed props that are passed as opts
    const optsKeys = Object.keys(opts);
    optsKeys.forEach(key => {
      delete (passedProps as any)[key];
    });

    return (
      <ShareButton<LinkOptions>
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

//HN_LINK_FORMAT = 'https://news.ycombinator.com/submitlink?t={0}&u={1}',
//https://news.ycombinator.com/submitlink?url=https%3A%2F%2Fwww.milvus.io%2Fblog%2Fdeep-dive-1-milvus-architecture-overview.md
//https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.milvus.io%2Fblog%2Fdeep-dive-1-milvus-architecture-overview.md
//正确案例：
//https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.milvus.io%2Fblog%2Fdeep-die-1-milvus-architecture-overview.md&text=Builcccg%20a%20Vector%20Database%20for%20Scalable%20Similarity%20Search

//正确案例：
//https://news.ycombinator.com/submitlink?t=Share-buttons%20by%20Yauheni%20Pakala%20-%20%20&u=https%3A%2F%2Fgithub.com%2Fwcoder%2Fshare-buttons



function hackerNewsLink(
  url: string,
  {
    title,
    via,
    hashtags = [],
    related = [],
  }: { title?: string; via?: string; hashtags?: string[]; related?: string[] },
) {
  assert(url, 'hackernews.url');
  assert(Array.isArray(hashtags), 'hackernews.hashtags is not an array');
  assert(Array.isArray(related), 'hackernews.related is not an array');
  console.log(title, url);

  return (
    'https://news.ycombinator.com/submitlink' +
    objectToGetParams({
      t: title,
      u: url,
      // via,
      // hashtags: hashtags.length > 0 ? hashtags.join(',') : undefined,
      // related: related.length > 0 ? related.join(',') : undefined,
    })
  );
}

const hackerNewsShareButton = createShareButton<{
  title?: string;
  via?: string;
  hashtags?: string[];
  related?: string[];
}>(
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
  },
);

export default hackerNewsShareButton;
