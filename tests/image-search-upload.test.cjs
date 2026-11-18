const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');
const axios = require('axios');
const { createServer } = require('node:http');
const { once } = require('node:events');

test('image search uploads file bytes and search fields as multipart form data', async t => {
  const source = fs.readFileSync(
    path.join(__dirname, '../src/http/imageSearch.js'),
    'utf8'
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText;
  let request;
  const client = {};
  const result = [[{ id: 'sample-image' }], 0.1];
  const server = createServer(async (input, response) => {
    const chunks = [];
    for await (const chunk of input) chunks.push(chunk);
    request = new Request(`http://localhost${input.url}`, {
      method: input.method,
      headers: input.headers,
      body: Buffer.concat(chunks),
    });
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify(result));
  });
  t.after(() => new Promise(resolve => server.close(resolve)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  new Function('exports', 'require', code)(client, name => {
    assert.equal(name, 'axios');
    return {
      create: config => {
        assert.equal(config.baseURL, 'https://demos.milvus.io');
        return axios.create({
          ...config,
          baseURL: `http://127.0.0.1:${server.address().port}`,
          adapter: 'http',
          proxy: false,
        });
      },
    };
  });

  const bytes = new Uint8Array([137, 80, 78, 71, 0, 255, 13, 10]);
  const form = new FormData();
  form.append('file', new Blob([bytes], { type: 'image/png' }), 'sample.png');
  form.append('Num', '16');
  form.append('Page', '2');
  form.append('Device', '1');

  assert.deepEqual(await client.search(form), result);
  assert.equal(new URL(request.url).pathname, '/api/v1/search');
  assert.equal(request.method, 'POST');
  assert.match(request.headers.get('content-type'), /^multipart\/form-data; boundary=/);
  const uploaded = await request.formData();
  assert.equal(uploaded.get('file').name, 'sample.png');
  assert.equal(uploaded.get('file').type, 'image/png');
  assert.deepEqual(new Uint8Array(await uploaded.get('file').arrayBuffer()), bytes);
  for (const key of ['Num', 'Page', 'Device']) {
    assert.equal(uploaded.get(key), form.get(key));
  }
});
