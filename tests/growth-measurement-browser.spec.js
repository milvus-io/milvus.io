const { test, expect } = require('@playwright/test');
const fs = require('fs');
const ts = require('typescript');
const sources = {};
for (const [name, file] of Object.entries({"growth-measurement": "src/utils/growth-measurement.ts", "acquisition-context": "src/utils/acquisition-context.ts", "cloud-attribution": "src/utils/cloud-attribution.ts", "track-cloud-links": "src/utils/track-cloud-links.ts"})) sources[name] = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
test('one actual activation has one consented ID shared by event and navigation, then revocation removes it', async ({ page }) => {
  await page.route('http://localhost:8459/**', route => route.fulfill({ contentType: 'text/html', body: '<html lang="en"><head><link rel="canonical" href="https://milvus.io/pricing"></head><body><header><a id="cloud" href="https://cloud.zilliz.com/signup?token=destination-only">Cloud</a></header><main></main></body></html>' }));
  await page.goto('http://localhost:8459/pricing?utm_campaign=first');
  await page.evaluate(sources => {
    const cache = {};
    window.consent = true;
    window.cc = { validConsent: () => window.consent !== undefined, allowedCategory: category => category === 'analytics' && window.consent === true };
    document.cookie = 'CookieConsent=true; path=/';
    const load = name => {
      name = name.replace('@/utils/', '').replace('./', '');
      if (name === 'react') return { useEffect: fn => { window.cleanup = fn(); } };
      if (name === 'next/router') return { useRouter: () => ({ asPath: '/pricing?utm_campaign=first' }) };
      if (cache[name]) return cache[name];
      const exports = {};
      cache[name] = exports;
      new Function('exports', 'require', sources[name])(exports, load);
      return exports;
    };
    window.cleanup = load('track-cloud-links').trackCloudLinks(document.body, 'pricing', {}, new WeakMap(), load('acquisition-context').getAcquisitionContext('milvus.io', '/pricing?utm_campaign=first', '', window.sessionStorage));
    document.body.addEventListener('click', e => e.preventDefault());
    document.body.addEventListener('auxclick', e => e.preventDefault());
  }, sources);
  expect(new URL(await page.locator('#cloud').getAttribute('href')).searchParams.has('handoff_id')).toBe(false);
  await page.locator('#cloud').click();
  const first = await page.evaluate(() => ({ href: document.querySelector('#cloud').href, events: window.dataLayer.filter(e => e.cta_action === 'cloud_signup') }));
  expect(first.events).toHaveLength(1);
  const firstId = new URL(first.href).searchParams.get('handoff_id');
  expect(firstId).toMatch(/^[a-f0-9-]{36}$/);
  expect(first.events[0]).toMatchObject({ handoff_id: firstId, analytics_consent: 'granted', cta_destination: 'https://cloud.zilliz.com/signup', content_id: 'milvus.io/pricing', content_language: 'en' });
  expect(JSON.stringify(first.events)).not.toContain('destination-only');
  expect(JSON.stringify(first.events)).not.toContain('utm_campaign');
  await page.locator('#cloud').click();
  const secondId = new URL(await page.locator('#cloud').getAttribute('href')).searchParams.get('handoff_id');
  expect(secondId).not.toBe(firstId);
  await page.evaluate(() => { window.consent = false; document.cookie = 'CookieConsent=false; path=/'; });
  await page.locator('#cloud').click();
  expect(new URL(await page.locator('#cloud').getAttribute('href')).searchParams.has('handoff_id')).toBe(false);
  const events = await page.evaluate(() => window.dataLayer.filter(e => e.cta_action === 'cloud_signup'));
  expect(events).toHaveLength(3);
  expect(events[2]).toMatchObject({ handoff_id: '', analytics_consent: 'denied', user_data: null });
  const dynamic = await page.evaluate(async () => {
    document.cookie = 'CookieConsent=true; path=/';
    const a = document.createElement('a'); a.href = 'https://cloud.zilliz.com/signup';
    document.body.appendChild(a); a.click();
    await new Promise(resolve => setTimeout(resolve, 0));
    return { href: a.href, event: window.dataLayer.filter(e => e.cta_action === 'cloud_signup').at(-1) };
  });
  expect(new URL(dynamic.href).searchParams.get('handoff_id')).toBe(dynamic.event.handoff_id);
  expect(dynamic.event.handoff_id).toMatch(/^[a-f0-9-]{36}$/);

});
