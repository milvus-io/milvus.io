const { test, expect } = require('@playwright/test');
const ts = require('typescript');
const fs = require('fs');
const vm = require('vm');

function loadUtility(file, imports) {
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  }).outputText;
  const scope = { exports: {}, URL, require: name => imports[name] };
  vm.runInNewContext(compiled, scope);
  return scope.exports;
}
const urlUtility = loadUtility('src/utils/localize-zilliz-links.ts', {
  './zilliz-chinese-destinations.json': require('../src/utils/zilliz-chinese-destinations.json'),
});
const { localizeDocHomeCta } = loadUtility('src/utils/localize-doc-home-cta.ts', {
  './localize-zilliz-links': urlUtility,
});

for (const version of ['2.4', '2.5', '2.6', '3.0']) {
  test(`v${version} actual Chinese home changes only the signup CTA domain`, () => {
    const source = fs.readFileSync(`src/docs/localization/v${version}.x/site/zh/home/home.md`, 'utf8');
    expect(source.match(/https:\/\/cloud\.zilliz\.com\/signup/g)).toHaveLength(1);
    expect(localizeDocHomeCta(source, 'zh')).toBe(source.replace('https://cloud.zilliz.com/signup', 'https://cloud.zilliz.com.cn/signup'));
    for (const lang of ['en', 'zh-hant', 'ja']) {
      expect(localizeDocHomeCta(source, lang)).toBe(source);
    }
  });
}

test('matches a class token and real attributes while retaining their formatting and URL suffix', () => {
  const source = `<a title='href="https://cloud.zilliz.com/signup" >' HREF = 'https://cloud.zilliz.com/signup?utm_source=x&amp;other=a%20b#start' data-id="1" CLASS="other cta-global active">CTA</a>`;
  const expected = source.replace("HREF = 'https://cloud.zilliz.com/signup", "HREF = 'https://cloud.zilliz.com.cn/signup");
  expect(localizeDocHomeCta(source, 'zh')).toBe(expected);
  expect(localizeDocHomeCta('<a href=https://cloud.zilliz.com/signup class=cta-global>CTA</a>', 'zh')).toBe('<a href=https://cloud.zilliz.com.cn/signup class=cta-global>CTA</a>');
});

test('other links, lookalike attributes, comments and code remain byte-for-byte unchanged', () => {
  const sources = [
    '<a href="https://cloud.zilliz.com/signup">other</a>',
    '<a class="cta-global-other" href="https://cloud.zilliz.com/signup">other</a>',
    '<a data-class="cta-global" href="https://cloud.zilliz.com/signup">other</a>',
    `<a title='class="cta-global"' href="https://cloud.zilliz.com/signup">other</a>`,
    '<a class="cta-global" data-href="https://cloud.zilliz.com/signup">other</a>',
    '<a class="cta-global" href="https://cloud.zilliz.com/signin">other</a>',
    '<a class="cta-global" href="https://zilliz.com/contact-sales">other</a>',
    '<a class="cta-global" href="https://cloud.zilliz.com.evil.test/signup">other</a>',
    '<a class="cta-global" href="https://cloud.zilliz.com/signup-extra">other</a>',
    '<a class="cta-global" href="https://cloud.zilliz.com.cn/signup">other</a>',
  ];
  const target = '<a class="cta-global" href="https://cloud.zilliz.com/signup">example</a>';
  sources.push(`<!-- ${target} -->`, `<pre><code>${target}</code></pre>`, `<script>const example = '${target}';</script>`);
  for (const source of sources) expect(localizeDocHomeCta(source, 'zh')).toBe(source);
});
