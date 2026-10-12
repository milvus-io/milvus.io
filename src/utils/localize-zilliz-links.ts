import chineseDestinations from './zilliz-chinese-destinations.json';

/** Localize only confirmed fixed navigation destinations for simplified Chinese. */
export function localizeZillizUrl(href: string, locale?: string): string {
  if (locale !== 'zh' || !href || !/^(https?:)?\/\//i.test(href)) return href;
  try {
    const url = new URL(href, 'https://milvus.io');
    const path = url.pathname.replace(/\/$/, '') || '/';
    const authority = /^(?:https?:)?\/\/([^/\?#]+)/i.exec(href)?.[1];
    const target = chineseDestinations[`${url.hostname}${path}`];
    if (!target || authority?.toLowerCase() !== url.hostname) return href;
    // All approved destinations share the source path; change only the authority.
    return href.replace(/^(https?:)?\/\/[^/\?#]+/i, `$1//${new URL(target).host}`);
  } catch {
    return href;
  }
}
