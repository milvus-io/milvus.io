import Link from 'next/link';
import InternalLinkProps from 'next/link';

export default function CustomLink(props: any) {
  const { href, target, ...rest } = props;

  const isExternalLink = href.startsWith('http');

  return (
    <>
      {isExternalLink ? (
        <a {...rest} target="_blank" rel="noopener noreferrer" href={href}></a>
      ) : (
        <Link {...rest} href={href} target={target}></Link>
      )}
    </>
  );
}
