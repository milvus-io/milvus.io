import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Layout from '@/components/layout/commonLayout';
import { useStore } from '@/hooks/use-store';
import { LanguageEnum } from '@/types/localization';
import i18n, { loadI18nResources } from '@/i18n/client';
import styles from './landing.module.css';
import { parseCloudEntryUrl } from '@/utils/cloud-attribution';

type Cta = { label: string; href: string };
type Table = { h2?: string; caption: string; heads: string[]; rows: string[][]; note?: string };
type Bench = { title: string; caption: string; unit: string; source: string; sourceUrl: string;
  rows: { system: string; label: string; value: number; detail: string; highlight?: boolean }[];
  cta?: { text: string; label: string; href: string } };
type Feature = { title: string; body: string; bullets?: string[] };
type PageData = {
  slug: string; path: string; nav: string; title: string; description: string; h1: string;
  lang: string; layout?: string; intro?: string; sub?: string; proof: string[]; logos?: string[];
  primary_cta: Cta; secondary_cta: Cta; diagram: { caption: string }; sources: string[];
  sections?: { id: string; nav: string; h2: string; paragraphs?: string[]; bullets?: string[];
    table?: Table; bench?: Bench[]; note?: string }[];
  stats?: { value: string; label: string; source: string }[];
  benefits?: Feature[]; benefits_h2?: string; feature_blocks?: Feature[]; feature_blocks_h2?: string;
  compare?: Table; bench?: Bench[];
  code?: { h2: string; intro: string; lang: string; code: string; note: string };
  faqs: [string, string][]; stories?: { name: string; text: string; href: string }[];
  managed?: { h2: string; body: string }; final?: { h2: string; body: string };
};
type Props = { page: PageData; twinPath: string; lang: string;
  related: { title: string; path: string }[]; references: { title: string; slug: string }[] };
const HOST = 'https://milvus.io';
const json = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
function useLandingLocale(lang: string) {
  const { state, dispatch } = useStore();
  useEffect(() => {
    const locale = lang === 'zh' ? LanguageEnum.CHINESE : LanguageEnum.ENGLISH;
    let active = true;
    loadI18nResources(locale).then(async () => {
      if (!active) return;
      await i18n.changeLanguage(locale);
      if (active && state.locale !== locale) dispatch({ type: 'SET_LOCALE', payload: locale });
    });
    return () => { active = false; };
  }, [lang, state.locale, dispatch]);
}

export function LandingHead({ title, description, path, twinPath, zh, image, faqs = [] }: {
  title: string; description: string; path: string; twinPath: string; zh: boolean;
  image?: string; faqs?: [string, string][];
}) {
  const en = zh ? twinPath : path;
  const chinese = zh ? path : twinPath;
  const url = HOST + path;
  const group = path.includes('/compare') ? 'compare' : 'solutions';
  const groupPath = `${zh ? '/zh' : ''}/${group}`;
  const graph = [
    { '@type': 'WebPage', '@id': url, url, name: title, description,
      inLanguage: zh ? 'zh-Hans' : 'en', ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: HOST + image } } : {}),
      publisher: { '@type': 'Organization', name: 'Milvus', url: HOST } },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: zh ? '首页' : 'Home', item: HOST + (zh ? '/zh' : '/') },
      { '@type': 'ListItem', position: 2, name: group === 'compare' ? (zh ? '产品对比' : 'Compare') : (zh ? '解决方案' : 'Solutions'), item: HOST + groupPath },
      ...(path !== groupPath ? [{ '@type': 'ListItem', position: 3, name: title, item: url }] : []),
    ] },
    ...(faqs.length ? [{ '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a },
    })) }] : []),
  ];
  return <Head>
    <title>{title}</title><meta name="description" content={description} />
    <meta name="robots" content="index,follow" />
    <link rel="alternate" hrefLang="en" href={HOST + en} key="landing-en" />
    <link rel="alternate" hrefLang="zh-Hans" href={HOST + chinese} key="landing-zh" />
    <link rel="alternate" hrefLang="x-default" href={HOST + en} key="landing-default" />
    <meta property="og:title" content={title} /><meta property="og:description" content={description} />
    <meta property="og:url" content={url} /><meta property="og:type" content="website" key="og-type" />
    <meta property="og:locale" content={zh ? 'zh_CN' : 'en_US'} />
    <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    <meta name="twitter:title" content={title} /><meta name="twitter:description" content={description} />
    {image && <><meta property="og:image" content={HOST + image} key="og-image" />
      <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} /><meta name="twitter:image" content={HOST + image} /></>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json({ '@context': 'https://schema.org', '@graph': graph }) }} />
  </Head>;
}

function DataTable({ table }: { table?: Table }) {
  if (!table) return null;
  return <div className="table-wrap" role="region" aria-label={table.caption} tabIndex={0}>
    <table className={`cols-${table.heads.length}`}><caption>{table.caption}</caption>
      <thead><tr>{table.heads.map((h, i) => <th scope="col" key={i}>{h || ' '}</th>)}</tr></thead>
      <tbody>{table.rows.map((row, i) => <tr key={i}>{row.map((v, j) => j === 0
        ? <th scope="row" key={j}>{v}</th> : <td key={j}>{v}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

function CodeBlock({ code, zh, onCopy }: { code: PageData['code']; zh: boolean; onCopy: (success: boolean) => void }) {
  const [status, setStatus] = useState('');
  if (!code) return null;
  const copy = async () => {
    try { await navigator.clipboard.writeText(code.code); }
    catch { setStatus(zh ? '无法自动复制，请选择代码复制。' : 'Unable to copy automatically. Select the code to copy it.'); onCopy(false); return; }
    setStatus(zh ? '已复制' : 'Copied'); onCopy(true);
  };
  return <div className="code-section"><h2>{code.h2}</h2><p className="section-lead">{code.intro}</p>
    <div className="code-card"><div className="code-bar"><span>{code.lang}</span>
      <button type="button" className="copy-btn" onClick={copy}>{zh ? '复制代码' : 'Copy code'}</button>
    </div><pre><code>{code.code}</code></pre></div>
    <p className="copy-status" role="status">{status}</p><p className="code-note">{code.note}</p>
  </div>;
}

export default function LandingPage({ page: p, twinPath, related, references, lang }: Props) {
  useLandingLocale(lang);
  const zh = lang === 'zh';
  const prefix = zh ? '/zh' : '';
  const group = p.path.includes('/compare/') ? 'compare' : 'solutions';
  const groupLabel = group === 'compare' ? (zh ? '产品对比' : 'Compare') : (zh ? '解决方案' : 'Solutions');
  const href = (value: string) => {
    const u = new URL(value, HOST);
    if (u.hostname === 'milvus.io') return u.pathname + u.search + u.hash;
    if (u.hostname === 'zilliz.com' || u.hostname.endsWith('.zilliz.com') || u.hostname === 'zilliz.com.cn' || u.hostname.endsWith('.zilliz.com.cn')) {
      u.searchParams.set('utm_source', 'milvus.io'); u.searchParams.set('utm_medium', 'seo-landing'); u.searchParams.set('utm_campaign', p.slug);
    }
    return u.toString();
  };
  const destination = (value: string) => {
    const cloud = parseCloudEntryUrl(value);
    if (cloud) return cloud.pathname.replace(/\/$/, '') === '/signup' ? 'cloud_signup' : 'cloud_signin';
    const url = new URL(value, HOST);
    if (url.hostname === 'milvus.io') return /^\/docs(?:\/|$)/.test(url.pathname) ? 'docs' : 'milvus';
    if (url.hostname === 'github.com') return 'github';
    return 'external';
  };
  const emit = (event: string, location: string, target: string, entryButton = '', url = '') => {
    const w = window as Window & { dataLayer?: Record<string, unknown>[] };
    (w.dataLayer = w.dataLayer || []).push({ event, landing_page: p.path, landing_topic: p.slug,
      cta_location: location, cta_destination: target, entry_button: entryButton,
      link_url: url.split(/[?#]/)[0] });
  };
  const cta = (c: Cta, secondary = false, event?: string, location = 'hero') => {
    const target = destination(c.href);
    const name = event || (target === 'cloud_signup' ? 'cta_zilliz_signup_click' : target === 'docs' ? 'cta_docs_click' : 'cta_link_click');
    return <a href={href(c.href)} className={`button${secondary ? ' secondary' : ''}`}
      data-track={name} data-cta-location={location} data-cta-destination={target}
      data-entry-button={`seo_${p.slug}_${name}${target === 'cloud_signup' ? '_cloud' : ''}`}>{c.label}</a>;
  };
  const bench = (b: Bench, i: number) => <div key={i}><figure className="bench">
    <figcaption><strong>{b.title}</strong><span>{b.caption}</span></figcaption>
    <ul className="bench-list">{b.rows.map((r, j) => <li className={`bench-row${r.highlight ? ' is-hl' : ''}`} key={j}>
      <span className="bench-name"><strong>{r.system}</strong><span>{r.label}</span></span>
      <span className="bench-track"><span className="bench-bar" style={{width: `${100 * r.value / Math.max(...b.rows.map(x => x.value))}%`}} />
        <span className="bench-val">{r.value.toLocaleString('en-US', { maximumFractionDigits: 2 })} <small>{b.unit}</small></span></span>
      <span className="bench-detail">{r.detail}</span>
    </li>)}</ul><p className="bench-source"><a href={href(b.sourceUrl)}>{b.source}</a></p>
  </figure>{b.cta && <div className="bench-cta"><p>{b.cta.text}</p>{cta(b.cta, true, 'cta_benchmark_click', 'benchmark')}</div>}</div>;
  const stats = p.stats?.length ? <div className={`stat-grid count-${p.stats.length}`}>{p.stats.map((s, i) => <div className="stat-card" key={i}>
    <strong className="stat-value">{s.value}</strong><span className="stat-label">{s.label}</span><a className="stat-source" href={href(s.source)}>{zh ? '查看来源' : 'View source'}</a>
  </div>)}</div> : null;
  const track = (e: React.MouseEvent<HTMLElement>) => {
    const target = (e.target as Element)?.closest?.<HTMLElement>('[data-track]');
    if (!target) return;
    const url = target.getAttribute('href') || '';
    emit(target.dataset.track, target.dataset.ctaLocation || '', url ? destination(url) : '',
      target.dataset.entryButton || '', url);
  };
  return <Layout canonicalUrl={HOST + p.path} disableSelfHreflang disableLangSelector>
    <LandingHead title={p.title} description={p.description} path={p.path} twinPath={twinPath} zh={zh}
      image={`/og/${p.slug}${zh ? '-zh' : ''}.png`} faqs={p.faqs} />
    <main className={styles.page} lang={zh ? 'zh-Hans' : 'en'} onClick={track}>
      <a className="skip" href="#landing-content">{zh ? '跳转到正文' : 'Skip to content'}</a>
      <nav className="landing-subnav" aria-label={zh ? '解决方案导航' : 'Solution navigation'}><div className="wrap">
        <Link href={`${prefix}/solutions`}>{zh ? '解决方案' : 'Solutions'}</Link><Link href={`${prefix}/compare`}>{zh ? '产品对比' : 'Compare'}</Link>
        <Link href={twinPath} hrefLang={zh ? 'en' : 'zh-Hans'}>{zh ? 'English' : '简体中文'}</Link>
      </div></nav>
      <div className="wrap" id="landing-content"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href={`${prefix}/${group}`}>{groupLabel}</Link><span>{p.nav}</span></nav>
        <section className="hero" aria-labelledby="page-title"><div><h1 id="page-title">{p.h1}</h1><p className="intro">{p.intro || p.sub}</p>
          <div className="actions">{cta(p.primary_cta)}{cta(p.secondary_cta, true)}</div>
          <ul className="proof-row">{p.proof.map((v, i) => <li key={i}>{v}</li>)}</ul></div>
          <div className="hero-art"><figure><img src={`/images/seo-landings/${p.slug}-${lang}.svg`} alt={p.diagram.caption} width="520" height="324" /><figcaption>{p.diagram.caption}</figcaption></figure></div>
        </section>
        {!!p.logos?.length && <div className="logo-row"><span className="logo-label">{zh ? 'Milvus 与 Zilliz Cloud 用户' : 'Milvus and Zilliz Cloud adopters'}</span><ul>{p.logos.map(name => <li key={name}>{name}</li>)}</ul></div>}
      </div>
      {!!p.sections?.length && <nav className="section-nav" aria-label={zh ? '本页目录' : 'On this page'}><div className="wrap">{p.sections.map(s => <a href={`#${s.id}`} key={s.id}>{s.nav}</a>)}<a href="#faq">FAQ</a></div></nav>}
      {p.sections?.map((s, i) => <section className={`section${i % 2 ? ' shaded' : ''}`} id={s.id} key={s.id}><div className="wrap"><h2>{s.h2}</h2>
        <div className="prose">{s.paragraphs?.map((v,j) => <p key={j}>{v}</p>)}{!!s.bullets?.length && <ul className="prose-list">{s.bullets.map((v,j) => <li key={j}>{v}</li>)}</ul>}</div>
        {i === 0 && stats}{s.bench?.map(bench)}<DataTable table={s.table} />{s.note && <p className="table-note">{s.note}</p>}
      </div></section>)}
      {!!p.benefits?.length && <section className="section" id="why"><div className="wrap"><h2>{p.benefits_h2}</h2><div className="feature-grid benefit-grid">{p.benefits.map((b,i) => <article className="feature" key={i}><h3>{b.title}</h3><p>{b.body}</p></article>)}</div>{stats}{p.bench?.map(bench)}</div></section>}
      {!!p.feature_blocks?.length && <section className="section shaded" id="capabilities"><div className="wrap"><h2>{p.feature_blocks_h2 || (zh ? '核心能力' : 'Core capabilities')}</h2>
        <div className={`feature-blocks count-${p.feature_blocks.length}`}>{p.feature_blocks.map((b,i) => <article className="feature-block" key={i}><h3>{b.title}</h3><p>{b.body}</p>
          {!!b.bullets?.length && <ul className="prose-list">{b.bullets.map((v,j) => <li key={j}>{v}</li>)}</ul>}</article>)}</div></div></section>}
      {p.compare && <section className="section" id="compare"><div className="wrap"><h2>{p.compare.h2}</h2><DataTable table={p.compare} />{p.compare.note && <p className="table-note">{p.compare.note}</p>}</div></section>}
      {p.code && <section className="section shaded" id="code"><div className="wrap"><CodeBlock code={p.code} zh={zh}
        onCopy={success => emit(success ? 'copy_code_snippet' : 'copy_code_snippet_failed', 'code', 'clipboard')} /></div></section>}
      {!!p.stories?.length && <section className="section" id="customers"><div className="wrap"><h2>{zh ? '用户案例' : 'Customer stories'}</h2><div className="story-grid">{p.stories.map(s => <a className="story-card" href={href(s.href)} key={s.name} data-track="customer_story_click" data-cta-location="customer_story"><h3>{s.name}</h3><p>{s.text}</p><span>{zh ? '阅读案例' : 'Read the story'}</span></a>)}</div></div></section>}
      {!!references.length && <section className="section shaded" id="learn"><div className="wrap"><h2>{zh ? '延伸阅读' : 'Explore the concepts'}</h2><ul className="aiq-list">{references.map(r => <li key={r.slug}><a href={`/ai-quick-reference/${r.slug}`}>{r.title}</a></li>)}</ul></div></section>}
      <section className="section" id="faq"><div className="wrap faq-grid"><h2>{zh ? '常见问题' : 'Frequently asked questions'}</h2><div className="faq-list">{p.faqs.map(([q,a],i) => <details className="faq-item" key={i} open={i===0}><summary>{q}</summary><p>{a}</p></details>)}</div></div></section>
      {(p.final || p.managed) && <section className="final-cta"><div className="wrap"><h2>{(p.final || p.managed).h2}</h2><p>{(p.final || p.managed).body}</p><div className="actions">{cta(p.primary_cta, false, 'cta_final_click', 'final')}{cta(p.secondary_cta, true, 'cta_final_click', 'final')}</div></div></section>}
      {!!related.length && <nav className="related" aria-label={zh ? '相关页面' : 'Related pages'}><div className="wrap"><strong>{zh ? '相关页面' : 'Related pages'}</strong>{related.map(r => <Link href={r.path} key={r.path}>{r.title}</Link>)}</div></nav>}
      <section className="section" id="sources"><div className="wrap"><details><summary>{zh ? '资料来源与技术文档' : 'Sources and technical documentation'} ({p.sources.length})</summary><ul className="sources-list">{p.sources.map((s,i) => <li key={i}><a href={href(s)}>{s}</a></li>)}</ul></details></div></section>
    </main>
  </Layout>;
}

export function LandingIndex({ lang, group, pages }: { lang: string; group: string; pages: { title: string; path: string; description: string }[] }) {
  useLandingLocale(lang);
  const zh = lang === 'zh'; const prefix = zh ? '/zh' : '';
  const title = group === 'compare' ? (zh ? 'Milvus 产品对比' : 'Compare Milvus with other databases') : (zh ? 'Milvus 解决方案' : 'Milvus solutions');
  const description = zh ? '按架构、工作负载和检索需求选择适合的 Milvus 方案，查看代码、文档和用户案例。' : 'Choose a Milvus architecture and retrieval approach for your workload, with examples, documentation and customer stories.';
  const path = `${prefix}/${group}`;
  return <Layout canonicalUrl={HOST + path} disableSelfHreflang disableLangSelector><LandingHead title={title} description={description} path={path} twinPath={`${zh ? '' : '/zh'}/${group}`} zh={zh} />
    <main className={styles.page} lang={zh ? 'zh-Hans' : 'en'}><nav className="landing-subnav"><div className="wrap"><Link href={`${prefix}/solutions`}>{zh ? '解决方案' : 'Solutions'}</Link><Link href={`${prefix}/compare`}>{zh ? '产品对比' : 'Compare'}</Link><Link href={`${zh ? '' : '/zh'}/${group}`}>{zh ? 'English' : '简体中文'}</Link></div></nav>
      <div className="wrap"><div className="review-hero"><h1>{title}</h1><p>{description}</p></div><div className="index-grid">{pages.map(p => <Link className="index-card" href={p.path} key={p.path}><h2>{p.title}</h2><p>{p.description}</p></Link>)}</div></div>
    </main></Layout>;
}
