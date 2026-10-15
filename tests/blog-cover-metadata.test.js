const { test, expect } = require('@playwright/test');

const BASE = process.env.BLOG_TEST_BASE_URL || 'http://127.0.0.1:8000';

for (const locale of ['', '/zh']) {
  for (const [kind, id] of [
    ['article cover', 'choose-embedding-model-rag-2026.md'],
    ['fallback cover', '2019-11-08-data-management.md'],
  ]) {
    test(`${locale || '/en'} blog metadata uses one valid ${kind}`, async ({ request }) => {
      const response = await request.get(`${BASE}${locale}/blog/${id}`);
      expect(response.ok()).toBeTruthy();
      const html = await response.text();
      const pageData = JSON.parse(
        html.match(/<script\b[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]
      );
      const cover = pageData.props.pageProps.cover;
      expect(cover).toMatch(/^https:\/\/(?!https?:\/\/)/);
      const expectedHost = kind === 'article cover'
        ? 'assets.zilliz.com'
        : 'zilliz-cms.s3.us-west-2.amazonaws.com';
      expect(new URL(cover).hostname).toBe(expectedHost);

      // Check the initial HTML that link-preview crawlers receive, including
      // Next Head deduplication against the global default in _app.tsx.
      const ogImages = (html.match(/<meta\b[^>]*>/g) || [])
        .filter(tag => /\bproperty="og:image"/.test(tag));
      expect(ogImages).toHaveLength(1);
      expect(ogImages[0]).toContain(`content="${cover}"`);

      const schemas = [...html.matchAll(
        /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
      )].flatMap(match => JSON.parse(match[1]));
      const article = schemas.find(schema => schema['@type'] === 'BlogPosting');
      expect(article).toBeDefined();
      expect(article.image).toEqual([cover]);
      expect(html).not.toContain('https://https://');
    });
  }
}
