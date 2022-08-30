import { useEffect, useMemo } from 'react';

export default function useAlgolia(locale, version, condition = true) {
  // if pathname without version, like /docs/overview.md, need ignored by docsearch
  const docsearchMeta = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      !window.location.pathname.includes(version)
    ) {
      return [];
    }
    return [
      {
        name: 'docsearch:language',
        content: locale === 'cn' ? 'zh-cn' : locale,
      },
      {
        name: 'docsearch:version',
        content: version || '',
      },
    ];
  }, [locale, version]);

  return docsearchMeta;
}
