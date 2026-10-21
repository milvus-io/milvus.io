const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { createServer } = require('node:http');
const { createRequire } = require('node:module');
const { once } = require('node:events');
const test = require('node:test');

test('Tailwind 3 and both PostCSS nesting plugins preserve complex selectors', async () => {
  const postcss = require('postcss');
  const tailwind = require('tailwindcss');
  const tailwindRequire = createRequire(require.resolve('tailwindcss'));
  const config = require('../tailwind.config.js');
  const result = await postcss([
    require('postcss-nested'),
    tailwind({
      ...config,
      content: [{ raw: '<div class="group dark:hover:bg-blue-500 md:w-[calc(100%-1rem)] group-hover:opacity-50"></div>' }],
    }),
    require('autoprefixer'),
  ]).process('@tailwind utilities; .card { &:is(:hover, :focus) { color: red; } & > span { display: flex; } }', { from: undefined, map: { inline: false } });
  assert.match(result.css, /\.card:is\(:hover, :focus\)/);
  assert.match(result.css, /\.card > span/);
  assert.match(result.css, /background-color:/);
  assert.match(result.css, /calc\(100% - 1rem\)/);
  assert.match(result.css, /opacity: 0\.5/);
  assert.match(result.css, /@media \(min-width: 768px\)/);
  assert.ok(result.map.toJSON().mappings);
  const nested = await postcss([tailwindRequire('postcss-nested')])
    .process('.parent { & > :is(a, button) { color: blue; } }', { from: undefined });
  assert.match(nested.css, /\.parent > :is\(a, button\)/);
});

test('Next image dependency rasterizes SVG and resizes images', async () => {
  const nextRequire = createRequire(require.resolve('next/package.json'));
  const sharp = nextRequire('sharp');
  const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="10"><rect width="20" height="10" fill="red"/></svg>');
  const output = await sharp(svg).resize(10).png().toBuffer();
  const metadata = await sharp(output).metadata();
  assert.equal(metadata.format, 'png');
  assert.equal(metadata.width, 10);
  assert.equal(metadata.height, 5);
});

test('concurrently shell quoting preserves comment markers, newlines and substitutions', () => {
  const consumerRequire = createRequire(require.resolve('concurrently'));
  const { quote } = consumerRequire('shell-quote');
  for (const value of ['a b', 'a#comment\nsecond line', "a'b\"c", '$(printf injected); & | > <']) {
    const output = execFileSync('/bin/sh', ['-c', `printf %s ${quote([value])}`], { encoding: 'utf8' });
    assert.equal(output, value);
  }
});

test('Axios follows redirects without forwarding credentials to another hostname', async t => {
  const axios = require('axios');
  const server = createServer((request, response) => {
    if (request.url === '/redirect') {
      response.writeHead(302, { location: `http://localhost:${server.address().port}/target` });
      response.end();
    } else {
      response.setHeader('content-type', 'application/json');
      response.end(JSON.stringify({ authorization: request.headers.authorization || null, cookie: request.headers.cookie || null }));
    }
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const response = await axios.get(`http://127.0.0.1:${server.address().port}/redirect`, {
    proxy: false,
    timeout: 5000,
    lookup: (_host, options, callback) => callback(null, options.all ? [{ address: '127.0.0.1', family: 4 }] : '127.0.0.1', 4),
    headers: { authorization: 'Bearer test-only', cookie: 'session=test-only' },
  });
  assert.deepEqual(response.data, { authorization: null, cookie: null });
});
