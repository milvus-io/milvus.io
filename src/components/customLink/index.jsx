import React, { useMemo } from 'react';
import { Link } from 'gatsby';

export default function CustomLink(props) {
  const { href = '', target, ...restProps } = props;

  const linkConfig = useMemo(() => {
    const isExternalLink = href.includes('http');
    const config = isExternalLink
      ? {
          href,
          target: '_blank',
          rel: 'noreferrer',
        }
      : {
          href,
        };
    return {
      isExternalLink,
      config,
    };
  }, [href]);

  return (
    <>
      {linkConfig.isExternalLink ? (
        <a {...linkConfig.config} {...restProps}>
          {props.children}
        </a>
      ) : (
        <Link {...linkConfig.config} {...restProps}>
          {props.children}
        </Link>
      )}
    </>
  );
}
