const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { readPages, getLandingProps } = require('../src/server/seo-landing-catalog');

function load(file, globals = {}, dependencies = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const scope = { exports: {}, URL, URLSearchParams, ...globals,
    require: name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name) };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}

const attribution = load('src/utils/cloud-attribution.ts');
function render(page, clipboard = async () => {}, overrides = {}) {
  const window = { dataLayer: [] };
  const component = load('src/components/seo-landings/LandingPage.tsx', {
    window, navigator: { clipboard: { writeText: clipboard } },
  }, {
    'react': { useEffect() {}, useState: () => ['', () => {}] },
    'next/head': () => null, 'next/link': 'a',
    '@/components/layout/commonLayout': 'layout',
    '@/hooks/use-store': { useStore: () => ({ state: { locale: page.lang }, dispatch() {} }) },
    '@/types/localization': { LanguageEnum: { CHINESE: 'zh', ENGLISH: 'en' } },
    '@/i18n/client': { loadI18nResources() {} }, './landing.module.css': {},
    '@/utils/cloud-attribution': attribution,
  });
  const group = page.path.includes('/compare/') ? 'compare' : 'solutions';
  const props = getLandingProps(page.lang, group, page.path.split('/').pop()).props;
  const tree = component.default({ ...props, page: { ...props.page, ...overrides } });
  const all = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach(visit);
    all.push(node); visit(node.props?.children);
  }
  visit(tree);
  const main = all.find(node => node.type === 'main');
  const click = (node, nested = false) => {
    const dataset = {};
    for (const [key, value] of Object.entries(node.props)) {
      if (key.startsWith('data-')) dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
    }
    const anchor = { dataset, getAttribute: key => node.props[key] || null };
    // Simulate clicking either the anchor or a nested child of that anchor.
    const target = { closest: () => dataset.track ? anchor : null };
    main.props.onClick({ target: nested ? { closest: () => target.closest() } : target });
    return window.dataLayer.at(-1);
  };
  return { all, click, events: window.dataLayer };
}

test('all 16 actual landing pages preserve CTA placement and target, with one event per click', () => {
  for (const lang of ['en', 'zh']) for (const page of readPages(lang)) {
    const r = render(page);
    const ctas = r.all.filter(node => node.type === 'a' && ['hero', 'benchmark', 'final'].includes(node.props['data-cta-location']));
    assert.ok(ctas.length >= 4, page.path);
    for (const cta of ctas) {
      const before = r.events.length;
      const cloud = attribution.parseCloudEntryUrl(cta.props.href);
      const decorated = cloud ? attribution.buildCloudEntryUrl(cta.props.href,
        attribution.getMilvusEntryPage(page.path), { utm_source: 'adwords', utm_medium: 'cpc', gclid: 'test-click' },
        cta.props['data-entry-button']) : cta.props.href;
      const event = r.click({ ...cta, props: { ...cta.props, href: decorated } }, true);
      assert.equal(r.events.length, before + 1);
      const location = cta.props['data-cta-location'];
      assert.equal(event.event, location === 'benchmark' ? 'cta_benchmark_click'
        : location === 'final' ? 'cta_final_click' : cloud ? 'cta_zilliz_signup_click' : 'cta_docs_click');
      assert.equal(event.cta_location, location);
      assert.equal(event.cta_destination, cloud ? 'cloud_signup' : 'docs');
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
  assert.equal(event.cta_destination, 'external');
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
    assert.equal(r.events[0].cta_destination, 'clipboard');
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
