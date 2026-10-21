const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { getLandingSitemapPaths } = require('../src/server/seo-landing-catalog');

function compile(file, dependencies, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
      esModuleInterop: true },
  }).outputText;
  const scope = { exports: {}, ...globals, require: name => dependencies[name] };
  vm.runInNewContext(code, scope, { filename: file });
  return scope.exports;
}
const { LanguageEnum } = compile('src/types/localization.ts', {});

function localeHook(pathname, search = '', hash = '') {
  const assigned = [], pushed = [], cookies = [], dispatched = [];
  const locale = pathname.startsWith('/zh/') ? 'zh' : 'en';
  const hook = compile('src/hooks/use-global-locale.ts', {
    react: { useMemo: fn => fn(), useEffect() {} },
    'react-i18next': { useTranslation: () => ({ i18n: { changeLanguage() {} } }) },
    'next/navigation': { usePathname: () => pathname, useRouter: () => ({ push: p => pushed.push(p) }) },
    '@/types/localization': { LanguageEnum },
    '@/components/localization/const': { DOCS_LANGUAGE_DISABLED_MAP: {},
      SHOW_LANGUAGE_SELECTOR_VERSIONS: [], DISABLED_LANGUAGE_SELECTOR_VERSIONS: [] },
    '@/hooks/use-store': { useStore: () => ({ state: { locale }, dispatch: d => dispatched.push(d) }) },
    'js-cookie': { set: (...args) => cookies.push(args) },
    '@/i18n/client': { loadI18nResources: async () => {} },
  }, { document: { documentElement: {} }, window: { location: {
    search, hash, assign: p => assigned.push(p),
  } } });
  return { ...hook.useGlobalLocale(), assigned, pushed, cookies, dispatched };
}

test('all landing and hub routes expose only their available EN/ZH translations', () => {
  for (const { loc } of getLandingSitemapPaths()) {
    const h = localeHook(loc);
    assert.equal(h.disabled, false, loc);
    assert.deepEqual(Object.values(LanguageEnum).filter(l => !h.disabledLanguages.includes(l)), ['en', 'zh'], loc);
  }
});

test('switching all landing/hub pairs preserves topic, acquisition query and fragment', () => {
  for (const { loc } of getLandingSitemapPaths()) {
    const target = loc.startsWith('/zh/') ? 'en' : 'zh';
    const h = localeHook(loc, '?utm_source=google&gclid=test-id', '#faq');
    h.onLocaleChange(target);
    const path = target === 'en' ? loc.slice(3) : '/zh' + loc;
    assert.deepEqual(h.assigned, [path + '?utm_source=google&gclid=test-id#faq'], loc);
    assert.deepEqual(h.pushed, [], 'full document navigation initializes the matching language bundle');
    assert.equal(h.cookies[0][0], 'lang');
    assert.equal(h.cookies[0][1], target);
    assert.deepEqual(h.dispatched, [], 'the old landing must not reset the requested locale before navigation');
  }
});

test('unsupported landing languages do not create missing-page URLs or change preferences', () => {
  for (const target of Object.values(LanguageEnum).filter(l => !['en', 'zh'].includes(l))) {
    const h = localeHook('/solutions/hybrid-search');
    h.onLocaleChange(target);
    assert.deepEqual(h.assigned, []);
    assert.deepEqual(h.pushed, []);
    assert.deepEqual(h.cookies, []);
  }
});

test('docs, blog and other pages retain the existing language menu and client routing', () => {
  for (const [path, next] of [['/docs/quickstart.md', '/docs/zh/quickstart.md'],
    ['/blog/example', '/zh/blog/example'], ['/solutions-other', '/zh/solutions-other']]) {
    const h = localeHook(path);
    assert.equal(h.disabledLanguages.length, 0);
    h.onLocaleChange('zh');
    assert.deepEqual(h.pushed, [next]);
    assert.deepEqual(h.assigned, []);
  }
});
