import { localizeZillizUrl } from './localize-zilliz-links';

/** Only the fixed Cloud signup CTA on the simplified Chinese documentation homepage. */
export function localizeDocHomeCta(html: string, lang: string): string {
  if (lang !== 'zh') return html;

  // Consume comments, code and raw text as whole blocks before examining opening tags.
  const tokens = /<!--[\s\S]*?(?:-->|$)|<(pre|code|script|style|textarea)\b[^>]*>[\s\S]*?<\/\1\s*>|<[a-z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>/gi;
  return html.replace(tokens, tag => {
    if (!/^<a\s/i.test(tag)) return tag;

    const attributes = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
    let classes = '';
    let href: RegExpExecArray | undefined;
    const attributeText = tag.slice(2, -1);
    let attribute: RegExpExecArray | null;
    while ((attribute = attributes.exec(attributeText))) {
      const name = attribute[1].toLowerCase();
      if (name === 'class') classes = attribute[2] ?? attribute[3] ?? attribute[4] ?? '';
      if (name === 'href' && !href) href = attribute;
    }
    if (!classes.split(/\s+/).includes('cta-global') || !href) return tag;
    const value = href[2] ?? href[3] ?? href[4] ?? '';
    if (!/^https:\/\/cloud\.zilliz\.com\/signup(?:[?#]|$)/.test(value)) return tag;

    const localizedAttribute = href[0].replace(value, localizeZillizUrl(value, lang));
    const start = 2 + href.index;
    return tag.slice(0, start) + localizedAttribute + tag.slice(start + href[0].length);
  });
}
