const { test, expect } = require('@playwright/test');
const ts = require('typescript');
const fs = require('fs');
const vm = require('vm');
const source = fs.readFileSync('src/utils/localize-zilliz-links.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true } }).outputText;
const scope = { exports: {}, URL, require: name => require('../src/utils/zilliz-chinese-destinations.json') };
vm.runInNewContext(compiled, scope);
const { localizeZillizUrl: url } = scope.exports;

test('simplified Chinese preserves URL details and other locales', () => {
  const original = 'https://cloud.zilliz.com/signup?utm_source=milvusio&x=a%20b#start';
  expect(url(original, 'zh')).toBe(original.replace('.com/', '.com.cn/'));
  for (const locale of ['en', 'zh-hant', 'ja', undefined]) expect(url(original, locale)).toBe(original);
  expect(url('https://zilliz.com/cloud/?a=1#x', 'zh')).toBe('https://zilliz.com.cn/cloud/?a=1#x');
  expect(url('//zilliz.com/pricing#calculator', 'zh')).toBe('//zilliz.com.cn/pricing#calculator');
});

test('unknown pages, similar hosts, API endpoints and non-navigation URLs stay intact', () => {
  for (const original of ['https://zilliz.com/no-counterpart', 'https://zilliz.com.evil.test/', 'https://evilzilliz.com/', 'https://user@zilliz.com/', 'https://zilliz.com:443/', 'https://api.cloud.zilliz.com/', 'https://assets.zilliz.com/a.svg', '/cloud', 'javascript:alert(1)']) {
    expect(url(original, 'zh')).toBe(original);
  }
});

test('fixed business links localize while Chinese and unverified destinations remain intact', () => {
  expect(url('https://zilliz.com/contact-sales?contact_sales_traffic_source=milvusBot', 'zh')).toBe('https://zilliz.com.cn/contact-sales?contact_sales_traffic_source=milvusBot');
  expect(url('https://zilliz.com/share-your-story', 'zh')).toBe('https://zilliz.com.cn/share-your-story');
  expect(url('https://zilliz.com/blog/demystify-milvus-sizing-tool', 'zh')).toBe('https://zilliz.com.cn/blog/demystify-milvus-sizing-tool');
  for (const original of ['https://cloud.zilliz.com.cn/signup?utm_source=milvusio', 'https://zilliz.com.cn/pricing#calculator', 'https://docs.zilliz.com/docs/data-import', 'https://zilliz.com/blog/how-inkeep-and-milvus-built-rag-driven-ai-assisstant-for-smarter-interaction', 'https://zilliz.com/community/unstructured-data-meetup']) {
    expect(url(original, 'zh')).toBe(original);
  }
});
