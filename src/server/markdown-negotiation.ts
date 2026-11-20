import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { PageData } from '../components/seo-landings/LandingPage';
import { getLandingProps, listLandingPages, publicPage } from './seo-landing-catalog';
import { isIndexableLanguage, LanguageEnum } from '../types/localization';

const origin = 'https://milvus.io';
const locales = new Set<string>(Object.values(LanguageEnum));
const versionPattern = /^v\d+\.\d+\.x$/;
const filenamePattern = /^[\p{L}\p{N}][\p{L}\p{N}_.-]*\.md$/u;

const absolute = (url: string) => new URL(url, origin).href;
const link = (label: string, url: string) => `[${label}](${absolute(url)})`;
const bullets = (items: string[] = []) => items.map(item => `- ${item}`).join('\n');
const join = (items: string[]) => items.filter(Boolean).join('\n\n');
const heading = (title?: string, level = 2) => title && `${'#'.repeat(level)} ${title}`;
const table = (headers: string[], rows: (string | number)[][]) => {
  const row = (cells: (string | number)[]) =>
    `| ${cells.map(cell => String(cell ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')).join(' | ')} |`;
  return [row(headers), row(headers.map(() => '---')), ...rows.map(row)].join('\n');
};
const dataTable = (value: PageData['compare']) => value && join([
  heading(value.h2), value.caption, table(value.heads, value.rows), value.note,
]);
const benchmarks = (items: PageData['bench'] = [], zh = false) => items.map(b => join([
  heading(b.title, 3), b.caption,
  table(zh ? ['系统', '配置', '结果', '详情'] : ['System', 'Configuration', 'Result', 'Details'],
    b.rows.map(r => [r.system, r.label, `${r.value} ${b.unit}`, r.detail])),
  link(b.source, b.sourceUrl),
  b.cta && join([b.cta.text, link(b.cta.label, b.cta.href)]),
]));

export function serializeLanding(page: PageData, related: { title: string; path: string }[] = []) {
  const p = publicPage(page) as PageData;
  const zh = p.lang === 'zh';
  const features = (title: string, items: PageData['benefits']) => items?.length && join([
    heading(title), ...items.map(item => join([heading(item.title, 3), item.body, bullets(item.bullets)])),
  ]);
  const code = p.code;
  const fence = code && '\x60'.repeat(Math.max(3, ...(code.code.match(/`+/g) || []).map(run => run.length + 1)));
  return join([
    heading(p.h1, 1), p.description, p.intro, p.sub, bullets(p.proof),
    p.logos?.join(' · '),
    p.diagram?.caption,
    ...[p.primary_cta, p.secondary_cta].filter(Boolean).map(cta => link(cta.label, cta.href)),
    bullets(p.stats?.map(s => `${s.value} — ${s.label} (${s.source})`)),
    ...(p.sections || []).map(s => join([
      heading(s.h2), ...(s.paragraphs || []), bullets(s.bullets),
      ...benchmarks(s.bench, zh), dataTable(s.table), s.note,
    ])),
    features(p.benefits_h2, p.benefits), features(p.feature_blocks_h2, p.feature_blocks),
    dataTable(p.compare), ...benchmarks(p.bench, zh),
    code && join([heading(code.h2), code.intro, `${fence}${code.lang}\n${code.code}\n${fence}`, code.note]),
    p.stories?.length && join([heading(zh ? '用户案例' : 'Customer stories'),
      ...p.stories.map(s => join([heading(link(s.name, s.href), 3), s.text]))]),
    p.managed && join([heading(p.managed.h2), p.managed.body]),
    p.faqs?.length && join([heading(zh ? '常见问题' : 'FAQ'),
      ...p.faqs.map(([question, answer]) => join([heading(question, 3), answer]))]),
    p.final && join([heading(p.final.h2), p.final.body]),
    related.length && join([heading(zh ? '相关页面' : 'Related pages'), bullets(related.map(r => link(r.title, r.path)))]),
    p.sources?.length && join([heading(zh ? '来源' : 'Sources'), bullets(p.sources.map(url => link(url, url)))]),
  ]) + '\n';
}

function readContainedFile(root: string, file: string) {
  try {
    const candidate = fs.realpathSync(file);
    if (!candidate.startsWith(fs.realpathSync(root) + path.sep) || !fs.statSync(candidate).isFile()) {
      return undefined;
    }
    return fs.readFileSync(candidate, 'utf8');
  } catch (error) {
    if (['ENOENT', 'ENOTDIR', 'ELOOP'].includes(error.code)) return undefined;
    throw error;
  }
}

function findDoc(root: string, locale: string, version: string, id?: string) {
  const localized = path.join(root, 'localization', version, 'site', locale);
  const roots = locale === 'en' ? [localized, path.join(root, version, 'site/en')] : [localized];
  const search = (directory: string): string | undefined => {
    if (!fs.existsSync(directory) || !fs.realpathSync(directory).startsWith(fs.realpathSync(root) + path.sep)) {
      return undefined;
    }
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entry.name);
      const result = entry.isDirectory() ? search(candidate)
        : entry.isFile() && entry.name === id ? readContainedFile(root, candidate) : undefined;
      if (result !== undefined) return result;
    }
  };
  for (const site of roots) {
    const body = id ? search(site) : readContainedFile(root, path.join(site, 'home/home.md'));
    if (body !== undefined) return body;
  }
}

function readDocs(parts: string[], root: string) {
  const segments = parts.slice(1);
  const locale = locales.has(segments[0]) && segments[0] !== 'en' ? segments.shift() : 'en';
  const pinned = versionPattern.test(segments[0]) ? segments.shift() : undefined;
  if (segments.length > 1 || (segments.length && !filenamePattern.test(segments[0]))) return;
  const [id] = segments;
  const metadata = readContainedFile(root, path.join(root, 'version.json'));
  if (!metadata) return;
  const release = JSON.parse(metadata);
  const compare = (a: string, b: string) => a.localeCompare(b, 'en', { numeric: true });
  if (!versionPattern.test(release.version)) return;
  const versions = fs.readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(version => versionPattern.test(version) && compare(version, 'v2.4.x') >= 0 &&
      compare(version, release.version) <= 0 && (release.released !== 'no' || version !== release.version))
    .sort((a, b) => compare(b, a));
  const latest = versions[0];
  const version = pinned || latest;
  if (!versions.includes(version)) return;
  const body = findDoc(root, locale, version, id);
  if (body === undefined) return;
  const canonicalLocale = isIndexableLanguage(locale) ? locale : 'en';
  const versionSegment = version === latest || findDoc(root, canonicalLocale, latest, id) !== undefined
    ? '' : `/${version}`;
  return {
    body,
    canonical: absolute(`/docs${canonicalLocale === 'en' ? '' : `/${canonicalLocale}`}${versionSegment}${id ? `/${encodeURIComponent(id)}` : ''}`),
  };
}

export function resolveMarkdown(parts: string[], root = process.cwd()) {
  // Next has already decoded the segments. Reject separators, residual escapes,
  // and dot segments before using any values as filenames or URL components.
  if (!parts.length || parts.some(segment => !/^[\p{L}\p{N}][\p{L}\p{N}_.-]*$/u.test(segment))) return;
  const [first] = parts;
  const group = first === 'zh' ? parts[1] : first;
  if (['solutions', 'compare'].includes(group)) {
    const lang = first === 'zh' ? 'zh' : 'en';
    const [slug, extra] = parts.slice(lang === 'zh' ? 2 : 1);
    if (extra) return;
    const canonical = absolute('/' + parts.join('/'));
    if (!slug) {
      const title = group === 'solutions'
        ? (lang === 'zh' ? 'Milvus 解决方案' : 'Milvus solutions')
        : (lang === 'zh' ? 'Milvus 产品对比' : 'Compare Milvus with other databases');
      const pages = listLandingPages(lang, group).map(publicPage);
      return { canonical, body: join([heading(title, 1),
        bullets(pages.map(p => `${link(p.nav, p.path)}: ${p.description}`))]) + '\n' };
    }
    const result = getLandingProps(lang, group, slug);
    if (result.props) return { canonical, body: serializeLanding(result.props.page as PageData, result.props.related) };
    return;
  }
  if (first === 'docs') return readDocs(parts, path.join(root, 'src/docs'));
  const locale = first === 'blog' ? 'en' : first;
  const blog = first === 'blog' ? parts : parts.slice(1);
  if (!locales.has(locale) || (first === 'en') || blog[0] !== 'blog' ||
      blog.length !== 2 || !filenamePattern.test(blog[1])) return;
  const blogRoot = path.join(root, 'src/blogs');
  const dir = locale === 'en' ? 'blog/en' : `localization/blog/${locale}`;
  const body = readContainedFile(blogRoot, path.join(blogRoot, dir, blog[1]));
  if (!body) return;
  const title = matter(body).data.title;
  if (typeof title !== 'string' || !title.trim()) return;
  const prefix = locale !== 'en' && isIndexableLanguage(locale) ? `/${locale}` : '';
  return { body, canonical: absolute(`${prefix}/blog/${encodeURIComponent(blog[1])}`) };
}
