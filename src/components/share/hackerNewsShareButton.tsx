import React, { Ref, forwardRef } from 'react';
import ShareButton, { Props as ShareButtonProps } from 'react-share/lib/ShareButton';

function objectToGetParams (object: {
  [key: string]: string | number | undefined | null;
}) {
  const params = Object.entries(object)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return params.length > 0 ? `?${params.join('&')}` : '';
}

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

function hackerNewsLink(
  url: string,
  {
    title,
    via,
    hashtags = [],
    related = [],
  }: { title?: string; via?: string; hashtags?: string[]; related?: string[] },
) {

  return (
    'https://news.ycombinator.com/submitlink' +
    objectToGetParams({
      t: title,
      u: url,
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
