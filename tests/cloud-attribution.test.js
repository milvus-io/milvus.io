const { test, expect } = require('@playwright/test');
const ts = require('typescript');
const fs = require('fs');
const vm = require('vm');

function compile(file) {
  return ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    fileName: file,
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
}

const attributionSource = compile('src/utils/cloud-attribution.ts');
const trackingSource = compile('src/utils/track-cloud-links.ts');
const scope = { exports: {}, URL, URLSearchParams };
vm.runInNewContext(attributionSource, scope);
const { buildCloudEntryUrl, getAcquisitionParams, getMilvusEntryPage, CLOUD_ACQUISITION_STORAGE_KEY } = scope.exports;
const nav = 'https://cloud.zilliz.com/signup?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_nav_right&utm_content=homepage';

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}

test('homepage with query or fragment keeps its page label', () => {
  for (const route of ['/', '/?gclid=click', '/?utm_source=adwords#start', '/#start']) {
    expect(getMilvusEntryPage(route)).toBe('homepage');
  }
  expect(getMilvusEntryPage('/docs/quickstart.md?utm_source=adwords#install')).toBe('docs/quickstart.md');
  expect(getMilvusEntryPage('/zh?gclid=click')).toBe('zh');
});

test('versioned API routes use stable attribution labels without changing other paths', () => {
  for (const group of ['Partition (v2)', 'Partition%20(v2)', 'Partition%20%28v2%29']) {
    const route = `/api-reference/restful/v2.5.x/v2/${group}/Has.md`;
    const label = 'api-reference/restful/v2.5.x/v2/Partition-v2/Has.md';
    expect(getMilvusEntryPage(route + '?tab=example#code')).toBe(label);
    expect(getMilvusEntryPage('/' + label)).toBe(label);
    expect(new URL(buildCloudEntryUrl(nav, route.slice(1), {})).searchParams.get('entry_page')).toBe(label);
  }
  for (const route of ['/docs/100%25.md', '/docs/hello%20world.md', '/docs/example(other).md', '/zh/docs/overview.md']) {
    expect(getMilvusEntryPage(route)).toBe(route.slice(1));
  }
});

test('API banner handoff normalizes path fields and survives repeated decoration', async ({ page }) => {
  const label = 'api-reference/restful/v2.5.x/v2/Partition-v2/Has.md';
  await page.setContent('<a id="banner">Cloud</a>');
  await page.evaluate(({ attributionSource, trackingSource }) => {
    const attribution = new Function('exports', attributionSource + '; return exports;')({});
    const tracking = new Function('exports', 'require', trackingSource + '; return exports;')({}, () => attribution);
    const path = '/api-reference/restful/v2.5.x/v2/Partition%20(v2)/Has.md';
    const label = attribution.getMilvusEntryPage(path);
    document.querySelector('#banner').href = 'https://cloud.zilliz.com/signup?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_top_banner&utm_content=' + label;
    const links = new WeakMap();
    const cleanup = tracking.trackCloudLinks(document.body, label, {}, links);
    cleanup();
    window.cleanup = tracking.trackCloudLinks(document.body, label, {}, links);
  }, { attributionSource, trackingSource });
  const url = new URL(await page.locator('#banner').getAttribute('href'));
  expect(Object.fromEntries(url.searchParams)).toMatchObject({
    utm_source: 'milvusio', utm_medium: 'referral', utm_campaign: 'milvus_top_banner',
    utm_content: label, entry_page: label, entry_button: 'milvus_top_banner',
  });
  expect(url.href).not.toMatch(/%25(?:20|28|29)|%28v2%29/);
  await page.evaluate(() => window.cleanup());
});

test('tagged arrival survives unrelated query parameters and is replaced coherently by a new campaign', () => {
  const saved = storage();
  const first = getAcquisitionParams('/?utm_source=adwords&utm_medium=cpc&utm_campaign=alpha&gclid=first', saved);
  expect(getAcquisitionParams('/docs/quickstart.md?tab=python', saved)).toEqual(first);
  expect(getAcquisitionParams('/?utm_source=bing&utm_campaign=beta&msclkid=second', saved)).toEqual({
    utm_source: 'bing', utm_campaign: 'beta', msclkid: 'second',
  });
  expect(getAcquisitionParams('/docs/overview.md', saved)).not.toHaveProperty('gclid');
});

test('arbitrary query data and incoming entry labels are not forwarded or cached', () => {
  const saved = storage();
  expect(getAcquisitionParams('/?utm_source=adwords&email=a%40example.com&token=secret&entry_page=spoof', saved)).toEqual({ utm_source: 'adwords' });
  expect(saved.getItem(CLOUD_ACQUISITION_STORAGE_KEY)).not.toContain('secret');
  expect(saved.getItem(CLOUD_ACQUISITION_STORAGE_KEY)).not.toContain('email');
});

test('storage failures and malformed cache do not break current URL attribution', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  expect(getAcquisitionParams('/?gclid=click', blocked)).toEqual({ gclid: 'click' });
  expect(getAcquisitionParams('/docs', blocked)).toEqual({});
  const saved = storage();
  for (const invalid of ['not json', 'null', '[]']) {
    saved.setItem(CLOUD_ACQUISITION_STORAGE_KEY, invalid);
    expect(getAcquisitionParams('/docs', saved)).toEqual({});
  }
  saved.setItem(CLOUD_ACQUISITION_STORAGE_KEY, JSON.stringify({ utm_source: 'google', token: 'secret', gclid: 5 }));
  expect(getAcquisitionParams('/docs', saved)).toEqual({ utm_source: 'google' });
});

test('paid source and Milvus entry remain distinct, with no duplicate UTM keys', () => {
  const url = new URL(buildCloudEntryUrl(nav + '&utm_source=duplicate&plan=free#start', 'docs/quickstart.md', {
    utm_source: 'adwords', utm_medium: 'cpc', utm_campaign: 'Paid campaign', utm_content: 'creative A', gclid: 'click',
  }));
  expect(url.searchParams.getAll('utm_source')).toEqual(['adwords']);
  expect(url.searchParams.get('utm_campaign')).toBe('Paid campaign');
  expect(url.searchParams.get('utm_content')).toBe('creative A');
  expect(url.searchParams.get('entry_site')).toBe('milvus.io');
  expect(url.searchParams.get('entry_page')).toBe('docs/quickstart.md');
  expect(url.searchParams.get('entry_button')).toBe('milvus_nav_right');
  expect(url.searchParams.get('plan')).toBe('free');
  expect(url.hash).toBe('#start');
});

test('click-ID-only arrivals do not acquire misleading hard-coded referral UTMs', () => {
  const url = new URL(buildCloudEntryUrl(nav, 'homepage', { gclid: 'click' }));
  expect(url.searchParams.get('gclid')).toBe('click');
  expect(url.searchParams.has('utm_source')).toBe(false);
  expect(url.searchParams.has('utm_medium')).toBe(false);
  expect(url.searchParams.get('entry_button')).toBe('milvus_nav_right');
});

test('untagged visitors retain existing referral tags; Chinese Cloud and explicit button labels work', () => {
  const url = new URL(buildCloudEntryUrl(nav.replace('cloud.zilliz.com/', 'cloud.zilliz.com.cn/'), 'zh/docs/quickstart.md', {}, 'docs_start'));
  expect(url.hostname).toBe('cloud.zilliz.com.cn');
  expect(url.searchParams.get('utm_source')).toBe('milvusio');
  expect(url.searchParams.get('entry_page')).toBe('zh/docs/quickstart.md');
  expect(url.searchParams.get('entry_button')).toBe('docs_start');
  expect(new URL(buildCloudEntryUrl('https://cloud.zilliz.com/signin', 'homepage', {})).searchParams.get('entry_button')).toBe('cloud_signin');
});

test('only exact Cloud registration/login destinations receive attribution', () => {
  for (const href of ['/docs', 'https://zilliz.com/', 'https://cloud.zilliz.com.evil.test/signup', 'https://user@cloud.zilliz.com/signup', 'https://cloud.zilliz.com:123/signup', 'https://cloud.zilliz.com/api/signup', 'https://cloud.zilliz.com/signup-extra', 'javascript:alert(1)', 'mailto:a@example.com']) {
    expect(buildCloudEntryUrl(href, 'homepage', { gclid: 'click' })).toBe(href);
  }
});

test('actual DOM links, dynamic HTML, route changes and locale changes use the same attribution', async ({ page }) => {
  await page.setContent(`<a id="nav" href="${nav}" target="_blank" rel="noopener noreferrer"><span>Start</span></a>
    <a id="other" href="https://example.com/">Other</a><pre><a id="example" href="${nav}">Code example</a></pre>`);
  await page.evaluate(({ attributionSource, trackingSource }) => {
    const attribution = new Function('exports', attributionSource + '; return exports;')({});
    const tracking = new Function('exports', 'require', trackingSource + '; return exports;')({}, () => attribution);
    window.attribution = attribution;
    window.tracking = tracking;
    window.links = new WeakMap();
    window.cleanup = tracking.trackCloudLinks(document.body, 'homepage', { utm_source: 'adwords', gclid: 'first' }, window.links);
  }, { attributionSource, trackingSource });
  const values = selector => page.locator(selector).evaluate(a => Object.fromEntries(new URL(a.href).searchParams));
  expect(await values('#nav')).toMatchObject({ utm_source: 'adwords', gclid: 'first', entry_page: 'homepage', entry_button: 'milvus_nav_right' });
  await expect(page.locator('#nav')).toHaveAttribute('target', '_blank');
  await expect(page.locator('#nav')).toHaveAttribute('rel', 'noopener');
  await expect(page.locator('#nav')).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await expect(page.locator('#example')).toHaveAttribute('href', nav);
  await expect(page.locator('#other')).toHaveAttribute('href', 'https://example.com/');

  await page.evaluate(() => document.body.insertAdjacentHTML('beforeend', '<a id="doc" href="https://cloud.zilliz.com/signup" data-entry-button="docs_home">Try Cloud</a>'));
  await expect.poll(() => values('#doc')).toMatchObject({ gclid: 'first', entry_button: 'docs_home' });
  await page.locator('#doc').evaluate(a => a.href = 'https://cloud.zilliz.com.cn/signup');
  await expect.poll(() => values('#doc')).toMatchObject({ utm_source: 'adwords', entry_page: 'homepage' });
  await expect(page.locator('#doc')).toHaveAttribute('href', /cloud\.zilliz\.com\.cn/);

  await page.evaluate(() => {
    window.cleanup();
    window.cleanup = window.tracking.trackCloudLinks(document.body, 'docs/quickstart.md', { utm_source: 'bing', msclkid: 'second' }, window.links);
  });
  expect(await values('#nav')).toMatchObject({ utm_source: 'bing', msclkid: 'second', entry_page: 'docs/quickstart.md', entry_button: 'milvus_nav_right' });
  expect(await values('#nav')).not.toHaveProperty('gclid');
  await page.evaluate(() => {
    window.cleanup();
    document.querySelector('#nav').setAttribute('href', 'https://cloud.zilliz.com/signup');
  });
  await expect(page.locator('#nav')).toHaveAttribute('href', 'https://cloud.zilliz.com/signup');
});

test('capture handles a just-inserted link before MutationObserver runs', async ({ page }) => {
  await page.setContent('<main></main>');
  const href = await page.evaluate(({ attributionSource, trackingSource }) => {
    const attribution = new Function('exports', attributionSource + '; return exports;')({});
    const tracking = new Function('exports', 'require', trackingSource + '; return exports;')({}, () => attribution);
    const cleanup = tracking.trackCloudLinks(document.body, 'homepage', { gclid: 'click' }, new WeakMap());
    const a = document.createElement('a');
    a.href = 'https://cloud.zilliz.com/signup';
    a.addEventListener('click', e => e.preventDefault());
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    const result = a.href;
    cleanup();
    return result;
  }, { attributionSource, trackingSource });
  expect(new URL(href).searchParams.get('gclid')).toBe('click');
});

test('Cloud referrer policy survives DOM rewrites without changing other links or rel tokens', async ({ page }) => {
  await page.setContent(`<a id="cloud" href="${nav}" rel="nofollow Noreferrer">Cloud</a>
    <a id="other" href="https://example.com/" rel="noreferrer" referrerpolicy="no-referrer">Other</a>
    <a id="download" href="${nav}" rel="noreferrer" download>Download</a>
    <pre><a id="code" href="${nav}" rel="noreferrer">Example</a></pre>`);
  await page.evaluate(({ attributionSource, trackingSource }) => {
    const attribution = new Function('exports', attributionSource + '; return exports;')({});
    const tracking = new Function('exports', 'require', trackingSource + '; return exports;')({}, () => attribution);
    tracking.trackCloudLinks(document.body, 'homepage', {}, new WeakMap());
  }, { attributionSource, trackingSource });
  await expect(page.locator('#cloud')).toHaveAttribute('rel', 'nofollow noopener');
  await page.locator('#cloud').evaluate(a => {
    a.rel = 'sponsored noreferrer';
    a.referrerPolicy = 'unsafe-url';
  });
  await expect(page.locator('#cloud')).toHaveAttribute('rel', 'sponsored noopener');
  await expect(page.locator('#cloud')).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  for (const id of ['other', 'download', 'code']) {
    await expect(page.locator('#' + id)).toHaveAttribute('rel', 'noreferrer');
  }
  await expect(page.locator('#other')).toHaveAttribute('referrerpolicy', 'no-referrer');
  await page.locator('#cloud').evaluate(a => a.href = 'https://example.com/');
  await expect(page.locator('#cloud')).toHaveAttribute('rel', 'sponsored noreferrer');
  await expect(page.locator('#cloud')).toHaveAttribute('referrerpolicy', 'unsafe-url');
});

test('real Cloud navigation sends only the Milvus origin and isolates new tabs', async ({ context, page }) => {
  const requests = [];
  await context.route('https://milvus.io/**', route => route.fulfill({
    contentType: 'text/html',
    body: `<a id="en" href="https://cloud.zilliz.com/signup" target="_blank" rel="noreferrer">EN</a>
      <a id="cn" href="https://cloud.zilliz.com.cn/signup" target="_blank" rel="noreferrer">CN</a>`,
  }));
  for (const host of ['cloud.zilliz.com', 'cloud.zilliz.com.cn']) {
    await context.route('https://' + host + '/**', route => {
      requests.push({ url: route.request().url(), referer: route.request().headers().referer });
      return route.fulfill({ contentType: 'text/html', body: '<p>Cloud destination</p>' });
    });
  }
  await page.goto('https://milvus.io/docs/quickstart.md?gclid=test-click&private_field=local-only');
  await page.evaluate(({ attributionSource, trackingSource }) => {
    const attribution = new Function('exports', attributionSource + '; return exports;')({});
    const tracking = new Function('exports', 'require', trackingSource + '; return exports;')({}, () => attribution);
    tracking.trackCloudLinks(document.body, 'docs/quickstart.md', { gclid: 'test-click' }, new WeakMap());
  }, { attributionSource, trackingSource });
  for (const id of ['en', 'cn']) {
    const popupPromise = context.waitForEvent('page');
    await page.locator('#' + id).click();
    const popup = await popupPromise;
    await popup.waitForLoadState('domcontentloaded');
    expect(await popup.evaluate(() => document.referrer)).toBe('https://milvus.io/');
    expect(await popup.evaluate(() => window.opener === null)).toBe(true);
    const request = requests.at(-1);
    expect(request.referer).toBe('https://milvus.io/');
    const query = new URL(request.url).searchParams;
    expect(query.get('gclid')).toBe('test-click');
    expect(query.get('entry_page')).toBe('docs/quickstart.md');
    expect(query.has('private_field')).toBe(false);
    await popup.close();
  }
});
