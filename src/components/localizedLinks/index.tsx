import Link from 'next/link';
import React from 'react';
import { useStore } from '@/hooks/use-store';
import { localizeZillizUrl } from '@/utils/localize-zilliz-links';

export function LocalizedAnchor(props: React.ComponentProps<'a'>) {
  const {
    state: { locale },
  } = useStore();
  return <a {...props} href={localizeZillizUrl(props.href, locale)} />;
}

export function LocalizedLink(props: React.ComponentProps<typeof Link>) {
  const {
    state: { locale },
  } = useStore();
  const href =
    typeof props.href === 'string'
      ? localizeZillizUrl(props.href, locale)
      : props.href;
  return <Link {...props} href={href} />;
}
