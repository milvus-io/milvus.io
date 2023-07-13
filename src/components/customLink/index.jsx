import React, { useMemo } from 'react';

import { Link } from 'gatsby';

export default function CustomLink(props) {
  const { href = '', target, ...restProps } = props;

  const isExternalLink = useMemo(() => {
    return href.includes('http');
  }, [href]);

  return (
    <>
      {isExternalLink ? (
        <a href={href} target="_blank" {...restProps}></a>
      ) : (
        <Link href={href} target="_self" {...restProps}></Link>
      )}
    </>
  );
}
