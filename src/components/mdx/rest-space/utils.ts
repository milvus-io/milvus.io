import MarkdownIt from 'markdown-it';
import { i18n } from './i18n';

const markdown = new MarkdownIt({ html: true });

// Spec descriptions embed absolute https://milvus.io/docs|blog links authored
// against the English site; a zh-CN reader following one lands on English
// content. Rewrite those to the localized tree at render time (milvus.io
// localizes the docs tree as /docs/zh/... and the blog as /zh/blog/...).
// Ported from zdoc docs-ui rewriteDocLinks — the milvus.io subset. The
// docs.zilliz.com hosts are an external site from this one and keep their
// absolute URLs.
type DocsLinkLocale = 'en' | 'zh-CN';

const MILVUS_ORIGIN_PATTERN = /^https?:\/\/milvus\.io(?=\/|$)/;
const MILVUS_LOCALIZED_PATH = /^\/(?:zh|ja|ko|zh-hant)(?:\/|$)/;
const MILVUS_LOCALIZED_DOCS_PATH = /^\/docs\/(?:zh|ja|ko|zh-hant)(?:\/|$)/;

export const normalizeDocsLinkLocale = (
  lang: string | undefined | null
): DocsLinkLocale => {
  return lang === 'zh-CN' ? 'zh-CN' : 'en';
};

export const rewriteDocHref = (
  href: string,
  locale: DocsLinkLocale
): string => {
  if (typeof href !== 'string' || href === '') return href;
  if (locale === 'en') return href;

  const milvusOrigin = MILVUS_ORIGIN_PATTERN.exec(href);
  if (!milvusOrigin) return href;

  const rest = href.slice(milvusOrigin[0].length);
  if (MILVUS_LOCALIZED_PATH.test(rest)) return href;
  if (rest === '/docs' || rest.startsWith('/docs/')) {
    if (MILVUS_LOCALIZED_DOCS_PATH.test(rest)) return href;
    return `/docs/zh${rest.slice('/docs'.length)}`;
  }
  if (rest === '/blog' || rest.startsWith('/blog/')) {
    return `/zh${rest}`;
  }
  return href;
};

// Rewriting skips <pre>/<code> regions so displayed code samples keep the
// absolute URLs readers are meant to copy.
const HTML_CODE_REGION = /<(pre|code)\b[\s\S]*?<\/\1\s*>/gi;

const rewriteHrefAttributesIn = (segment: string, locale: DocsLinkLocale) => {
  return segment.replace(
    /(\shref\s*=\s*)(["'])([^"']*)\2/gi,
    (match, attribute: string, quote: string, href: string) => {
      const rewritten = rewriteDocHref(href, locale);
      return rewritten === href
        ? match
        : `${attribute}${quote}${rewritten}${quote}`;
    }
  );
};

export const rewriteHtmlHrefAttributes = (
  html: string,
  locale: DocsLinkLocale
): string => {
  if (typeof html !== 'string' || html === '') return html;
  let result = '';
  let cursor = 0;
  for (const region of html.matchAll(HTML_CODE_REGION)) {
    const start = region.index ?? 0;
    result += rewriteHrefAttributesIn(html.slice(cursor, start), locale);
    result += region[0];
    cursor = start + region[0].length;
  }
  return result + rewriteHrefAttributesIn(html.slice(cursor), locale);
};

// markdown-it wraps a leading text run in <p> even when block elements
// (<ul>/<table>/...) follow it; split those paragraphs so the emitted HTML
// stays valid.
export const sanitizeHtmlBlockParagraphs = (html = ''): string => {
  return String(html)
    .replace(
      /<p>([^<]*?)(\s*<(?:ul|ol|table|div|pre|blockquote)(?:\s|>))/gi,
      '<p>$1</p>$2'
    )
    .replace(
      /(<\/(?:ul|ol|table|div|pre|blockquote)>\s*)([^<][\s\S]*?)<\/p>/gi,
      '$1<p>$2</p>'
    )
    .replace(/<p>(\s*<(?:ul|ol|table|div|pre|blockquote)(?:\s|>))/gi, '$1')
    .replace(/(<\/(?:ul|ol|table|div|pre|blockquote)>\s*)<\/p>/gi, '$1');
};

export const getBaseUrl = (endpoint, lang, pubTarget) => {
  const condition = isControlPlane(endpoint);

  var server = 'https://api.cloud.zilliz.com';
  var children = `export BASE_URL="${server}"`;
  var prompt = '';

  if (condition && endpoint.includes('v1')) {
    server =
      lang === 'zh-CN'
        ? 'https://controller.api.${CLOUD_REGION}.zilliz.com.cn'
        : 'https://controller.api.${CLOUD_REGION}.zillizcloud.com';
    children =
      lang === 'zh-CN'
        ? `export CLOUD_REGION="ali-cn-hangzhou"\nexport BASE_URL="${server}"`
        : `export CLOUD_REGION="gcp-us-west1"\nexport BASE_URL="${server}"`;
    prompt = i18n[lang]['admonition.cloud.region'];
  }

  if (!condition) {
    server = 'https://${CLUSTER_ENDPOINT}';
    children = `export CLUSTER_ENDPOINT=""`;
    prompt = endpoint.includes('v2')
      ? i18n[lang]['admonition.cluster.endpoint.v2']
      : i18n[lang]['admonition.cluster.endpoint.v1'];
  }

  if (pubTarget === 'milvus') {
    server = 'http://localhost:19530';
    children = `export CLUSTER_ENDPOINT="${server}"`;
  }

  return {
    server,
    children,
    prompt,
  };
};

export const getLocalizedDescription = (value, lang) => {
  return value?.['x-i18n']?.[lang]?.description ?? value?.description ?? '';
};

export const textFilter = (text, targets, lang?) => {
  if (text === null || text === undefined) {
    return '';
  }

  text = String(text);
  const targetList = targets ? String(targets).split('.') : [];
  const matches = text ? matchFilterTags(text) : [];

  if (matches.length > 0) {
    var preText = text.slice(0, matches[0].startIndex);
    var matchText = text.slice(matches[0].startIndex, matches[0].endIndex);
    var postText = text.slice(matches[0].endIndex);
    var isTargetValid = targetList.includes(matches[0].target.trim());
    var startTagLength = `<${matches[0].tag} target="${matches[0].target}">`
      .length;
    var endTagLength = `</${matches[0].tag}>`.length;

    if (
      (matches[0].tag == 'include' && isTargetValid) ||
      (matches[0].tag == 'exclude' && !isTargetValid)
    ) {
      matchText = matchText.slice(startTagLength, -endTagLength);
    }

    if (
      (matches[0].tag == 'include' && !isTargetValid) ||
      (matches[0].tag == 'exclude' && isTargetValid)
    ) {
      matchText = '';
    }

    text = textFilter(preText + matchText + postText, targets, lang);
  }

  text = markdown.render(text).trim();

  // Rendered descriptions carry absolute milvus.io links authored against
  // the English site; keep readers in their own language.
  return rewriteHtmlHrefAttributes(
    sanitizeHtmlBlockParagraphs(text),
    normalizeDocsLinkLocale(lang)
  );
};

const matchFilterTags = text => {
  const startTagRegex = /<(include|exclude) target="(.+?)"/gm;
  const endTagRegex = /<\/(include|exclude)>/gm;
  const matches = [...text.matchAll(startTagRegex)];
  var returns = [];

  matches.forEach(match => {
    var tag = match[1];
    var rest = text.slice(match.index);

    var closeTagRegex = new RegExp(`</${tag}>`, 'gm');
    var closeTagMatch = [...rest.matchAll(closeTagRegex)];

    var startIndex = match.index;
    var endIndex = 0;

    for (let i = 0; i < closeTagMatch.length; i++) {
      var t = text.slice(
        startIndex,
        startIndex + closeTagMatch[i].index + closeTagMatch[i][0].length
      );

      var startCount = t.match(startTagRegex)
        ? t.match(startTagRegex).length
        : 0;
      var endCount = t.match(endTagRegex) ? t.match(endTagRegex).length : 0;

      if (startCount === endCount) {
        endIndex =
          startIndex + closeTagMatch[i].index + closeTagMatch[i][0].length;
        break;
      }
    }

    returns.push({
      tag: tag,
      target: match[2],
      startIndex: startIndex,
      endIndex: endIndex,
    });
  });

  return returns;
};

export const getRandomString = length => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const chooseParamExample = (param, lang, target) => {
  // Check x-i18n first (consistent with Primitive component)
  if (param['x-i18n']?.[lang]?.example !== undefined) {
    param.example = param['x-i18n'][lang].example;
    return param;
  }

  if (param.examples) {
    const validkey = Object.keys(param.examples).filter(key => {
      const ex = param.examples[key];
      const langMatch = !ex?.['x-target-lang'] || ex['x-target-lang'] === lang;
      const targetMatch =
        !ex?.['x-include-target'] || ex['x-include-target'].includes(target);
      return langMatch && targetMatch;
    })[0];

    if (validkey) {
      param.example = param.examples[validkey].value;
    }
  }

  return param;
};

export const filterSchemaOptions = (arr, lang, target) => {
  return arr
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => {
      const langMatch =
        !item?.['x-target-lang'] || item['x-target-lang'] === lang;
      const targetMatch =
        !item?.['x-include-target'] ||
        item['x-include-target'].includes(target);
      return langMatch && targetMatch;
    });
};

export const getExampleLabel = (example, key) => {
  return example?.summary || example?.['x-tab-label'] || `OPTION ${key}`;
};

const HTTP_STATUS_LABELS = {
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '204': 'No Content',
};

export const getResponseEntries = (responses = {}) => {
  if (!responses || typeof responses !== 'object' || Array.isArray(responses)) {
    return [];
  }

  return Object.entries(responses)
    .filter(
      ([status, response]) =>
        (/^[1-5]\d\d$/.test(status) || status === 'default') &&
        response &&
        typeof response === 'object'
    )
    .map(([status, response]) => ({
      status,
      label: HTTP_STATUS_LABELS[status] || '',
      response,
    }))
    .sort((left, right) => {
      if (left.status === 'default') return 1;
      if (right.status === 'default') return -1;
      return Number(left.status) - Number(right.status);
    });
};

export const getDefaultResponseStatus = (responses = {}) => {
  const entries = getResponseEntries(responses);
  return (
    entries.find(({ status }) => /^2\d\d$/.test(status))?.status ||
    entries[0]?.status ||
    ''
  );
};

// NOTE: deliberately kept as inline keyword matching — upstream zdoc resolves
// the keyword lists from Docusaurus planeConfig, which this site does not
// have. When upstream adds control-plane keywords, mirror them here.
export const isControlPlane = endpoint => {
  return (
    endpoint.includes('cloud') ||
    endpoint.includes('region') ||
    endpoint.includes('cluster') ||
    endpoint.includes('import') ||
    endpoint.includes('pipeline') ||
    endpoint.includes('project') ||
    endpoint.includes('metrics') ||
    endpoint.includes('migration') ||
    endpoint.includes('backup') ||
    endpoint.includes('restore') ||
    endpoint.includes('job')
  );
};
