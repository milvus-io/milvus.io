const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const path = require('node:path');
const crypto = require('node:crypto');
const { readPages, getLandingProps } = require('../src/server/seo-landing-catalog');

function load(file, globals = {}, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const scope = { exports: {}, URL, URLSearchParams, ...globals,
    require: name => {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name.startsWith('@/utils/') || name.startsWith('./')) {
        const target = name.startsWith('@/') ? name.replace('@/', 'src/') : path.join(path.dirname(file), name);
        return load(target + '.ts', globals, dependencies);
      }
      return require(name);
    } };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const attribution = load('src/utils/cloud-attribution.ts');

// The component renders React nodes; the shared capture tracker consumes DOM
// anchors. Model only the DOM surface it uses, and execute both real handlers
// in browser order. Attribution, consent, event payloads and UUIDs are real.
function render(page, clipboard = async () => {}, overrides = {}) {
  const window = { dataLayer: [] };
  const elements = [];
  const captures = [];
  class Element {
    constructor(type, props = {}, parent = null) {
      this.type = type; this.parentElement = parent; this.attrs = {}; this.dataset = {};
      for (const [key, value] of Object.entries(props)) {
        if (key === 'children' || key.startsWith('on') || value == null) continue;
        this.setAttribute(key, value);
      }
      elements.push(this);
    }
    setAttribute(key, value) {
      this.attrs[key] = String(value);
      if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = String(value);
    }
    getAttribute(key) { return this.attrs[key] ?? null; }
    hasAttribute(key) { return key in this.attrs; }
    removeAttribute(key) { delete this.attrs[key]; }
    closest(selector) {
      for (let node = this; node; node = node.parentElement) {
        if (selector === 'a[href]' && node.type === 'a' && node.hasAttribute('href')) return node;
        if (selector === '[data-track]' && node.hasAttribute('data-track')) return node;
        if (selector === 'pre, code' && ['pre', 'code'].includes(node.type)) return node;
        if (selector === node.type) return node;
      }
      return null;
    }
    querySelectorAll(selector) {
      assert.equal(selector, 'a[href]', 'Test DOM must explicitly model each selector the tracker uses');
      return elements.filter(node => node.type === 'a' && node.hasAttribute('href'));
    }
    addEventListener(type, callback, capture) { if (capture) captures.push({type, callback}); }
    removeEventListener() {}
  }
  class Anchor extends Element {
    get href() { return new URL(this.getAttribute('href'), 'https://milvus.io').href; }
    get referrerPolicy() { return this.getAttribute('referrerpolicy'); }
    set referrerPolicy(value) { this.setAttribute('referrerpolicy', value); }
  }
  const document = {
    cookie: 'CookieConsent=true', documentElement: {lang: page.lang},
    querySelector(selector) {
      if (selector === 'link[rel="canonical"]') return {href:'https://milvus.io' + page.path};
      if (selector === '[data-content-id]') return elements.find(n => n.hasAttribute('data-content-id')) || null;
      if (selector === 'main[lang]') return elements.find(n => n.type === 'main' && n.hasAttribute('lang')) || null;
      throw new Error('Unmodelled selector: ' + selector);
    },
  };
  const globals = {window, document, Element, HTMLAnchorElement: Anchor, crypto,
    MutationObserver: class { observe() {} disconnect() {} },
    navigator: {clipboard: {writeText: clipboard}}};
  const component = load('src/components/seo-landings/LandingPage.tsx', globals, {
    'react': { useEffect() {}, useState: () => ['', () => {}] },
    'next/head': () => null, 'next/link': 'a',
    '@/components/layout/commonLayout': 'layout',
    '@/hooks/use-store': { useStore: () => ({ state: { locale: page.lang }, dispatch() {} }) },
    '@/types/localization': { LanguageEnum: { CHINESE: 'zh', ENGLISH: 'en' } },
    '@/i18n/client': { loadI18nResources() {} }, './landing.module.css': {},
  });
  const group = page.path.includes('/compare/') ? 'compare' : 'solutions';
  const props = getLandingProps(page.lang, group, page.path.split('/').pop()).props;
  const tree = component.default({ ...props, page: { ...props.page, ...overrides } });
  const all = [];
  const nodes = new Map();
  const root = new Element('body');
  function visit(node, parent = root) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(child => visit(child, parent));
    all.push(node);
    const element = node.type === 'a' ? new Anchor('a', node.props, parent)
      : new Element(typeof node.type === 'string' ? node.type : 'component', node.props, parent);
    nodes.set(node, element);
    visit(node.props?.children, element);
  }
  visit(tree);
  const main = all.find(node => node.type === 'main');
  const tracker = load('src/utils/track-cloud-links.ts', globals);
  tracker.trackCloudLinks(root, attribution.getMilvusEntryPage(page.path),
    {utm_source:'adwords', utm_medium:'cpc', gclid:'test-click'}, new WeakMap());
  const click = (node, nested = false) => {
    const element = nodes.get(node) || (node.type === 'a'
      ? new Anchor('a', node.props, nodes.get(main)) : new Element(node.type, node.props, nodes.get(main)));
    const target = nested ? new Element('span', {}, element) : element;
    const event = {type:'click', button:0, defaultPrevented:false, target};
    captures.filter(listener => listener.type === 'click').forEach(listener => listener.callback(event));
    main.props.onClick(event);
    click.lastHref = element.type === 'a' ? element.href : '';
    return window.dataLayer.at(-1);
  };
  return { all, click, events: window.dataLayer };
}

test('all actual landing pages preserve CTA placement and target, with one event per click', () => {
  for (const lang of ['en', 'zh']) for (const page of readPages(lang)) {
    const r = render(page);
    const ctas = r.all.filter(node => node.type === 'a' && ['hero', 'benchmark', 'final'].includes(node.props['data-cta-location']));
    assert.equal(ctas.length, 3, page.path);
    const final = ctas.filter(n => n.props['data-cta-location'] === 'final');
    assert.equal(final.length, 1, page.path);
    assert.equal(new URL(final[0].props.href).hostname, lang === 'zh' ? 'cloud.zilliz.com.cn' : 'cloud.zilliz.com');
    const main = r.all.find(n => n.type === 'main');
    const lastSection = main.props.children.filter(Boolean).at(-1);
    assert.equal(lastSection.props.id, 'managed-cloud', 'Cloud banner follows sources and related links');
    assert.equal(r.all.filter(n => n.props?.className === 'bench-cta').length, 1, 'No repeated in-content Cloud banner');
    for (const cta of ctas) {
      const before = r.events.length;
      const cloud = attribution.parseCloudEntryUrl(cta.props.href);
      const decorated = cloud ? attribution.buildCloudEntryUrl(cta.props.href,
        attribution.getMilvusEntryPage(page.path), { utm_source: 'adwords', utm_medium: 'cpc', gclid: 'test-click' },
        cta.props['data-entry-button']) : cta.props.href;
      const event = r.click({ ...cta, props: { ...cta.props, href: decorated } }, true);
      assert.equal(r.events.length, before + 1);
      const location = cta.props['data-cta-location'];
      const globalCloud = cloud?.hostname === 'cloud.zilliz.com';
      assert.equal(event.event, globalCloud ? 'cta_zilliz_signup_click' : location === 'benchmark' ? 'cta_benchmark_click'
        : location === 'final' ? 'cta_final_click' : cloud ? 'cta_zilliz_signup_click' : 'cta_docs_click');
      assert.equal(event.cta_location, location);
      assert.equal(event.cta_action, cloud ? 'cloud_signup' : 'docs');
      const destination = new URL(cta.props.href, 'https://milvus.io');
      assert.equal(event.cta_destination, globalCloud ? destination.origin + destination.pathname : cta.props.href.split(/[?#]/)[0]);
      assert.equal(event.content_id, 'milvus.io' + page.path);
      if (globalCloud) {
        assert.match(event.handoff_id, /^[a-f0-9-]{36}$/);
        assert.equal(new URL(r.click.lastHref).searchParams.get('handoff_id'), event.handoff_id);
        assert.equal(event.analytics_consent, 'granted');
      }
      assert.equal(event.entry_button, cta.props['data-entry-button']);
      assert.equal(event.landing_page, page.path);
      assert.equal(event.link_url.includes('?'), false);
      assert.equal(JSON.stringify(event).includes('test-click'), false);
      if (cloud) {
        assert.equal(new URL(decorated).searchParams.get('utm_source'), 'adwords');
        assert.equal(new URL(decorated).searchParams.get('entry_button'), event.entry_button);
      }
    }
  }
});

test('button styling cannot label an external destination as a Cloud signup', () => {
  const page = readPages('en')[0];
  const r = render(page, undefined, { secondary_cta: { label: 'External', href: 'https://example.com/' } });
  const button = r.all.find(n => n.props?.['data-cta-location'] === 'hero' && n.props.className.includes('secondary'));
  const event = r.click(button);
  assert.equal(event.event, 'cta_link_click');
  assert.equal(event.cta_action, 'external');
  assert.equal(event.cta_destination, 'https://example.com/');
});

test('copy success/failure is recorded after the clipboard result, never again by click delegation', async () => {
  for (const success of [true, false]) {
    const page = readPages('en').find(p => p.code);
    let finish;
    const result = new Promise((resolve, reject) => { finish = () => success ? resolve() : reject(new Error('Denied')); });
    const r = render(page, () => result);
    const component = r.all.find(n => typeof n.type === 'function' && n.type.name === 'CodeBlock');
    const codeTree = component.type(component.props);
    const children = [];
    const walk = n => { if (Array.isArray(n)) return n.forEach(walk); if (n?.props) { children.push(n); walk(n.props.children); } };
    walk(codeTree);
    const button = children.find(n => n.type === 'button');
    const pending = button.props.onClick();
    r.click(button);
    assert.equal(r.events.length, 0, 'No successful copy event while clipboard is pending');
    finish(); await pending;
    assert.equal(r.events.length, 1);
    assert.equal(r.events[0].event, success ? 'copy_code_snippet' : 'copy_code_snippet_failed');
    assert.equal(r.events[0].cta_location, 'code');
    assert.equal(r.events[0].cta_action, 'clipboard');
    assert.equal(r.events[0].cta_destination, '');
  }
});

test('story clicks do not leak URL queries or leave CTA placement from a prior click', () => {
  const page = readPages('en').find(p => p.stories?.length);
  const r = render(page);
  r.click(r.all.find(n => n.props?.['data-cta-location'] === 'final'));
  const event = r.click(r.all.find(n => n.props?.['data-track'] === 'customer_story_click'), true);
  assert.equal(event.event, 'customer_story_click');
  assert.equal(event.cta_location, 'customer_story');
  assert.equal(event.entry_button, '');
  assert.equal(event.link_url.includes('?'), false);
});
