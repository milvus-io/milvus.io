/**
 * Generates public/llms.txt from the docs themselves.
 *
 * Why this is generated rather than hand-written: a stale llms.txt is worse
 * than none. When a page an agent needs is missing from the index, the agent
 * invents a plausible-looking slug instead — and an unknown doc id is a hard
 * 404 here (see CreateDocDetailProps.ts, which returns `notFound: true` under
 * the blocking fallback). Deriving every entry from menuStructure + frontmatter
 * keeps coverage at 100% and makes fabricated URLs unnecessary.
 *
 * Source of truth:
 *   src/docs/version.json                        -> latest docs version
 *   src/docs/<ver>/site/en/menuStructure/en.json -> section tree + link labels
 *   src/docs/<ver>/site/en (markdown frontmatter) -> per-page `summary`
 *   src/docs/API_Reference and API_Reference_MDX  -> per-SDK reference versions
 *
 * Prose that cannot be derived from the docs (the behavioural rules an agent
 * needs, the URL grammar) lives in the CURATED block below and is the only
 * part meant to be edited by hand.
 *
 * Run: npm run generate:llms
 */

const fs = require('fs');
const path = require('path');
const {
  LEARN_MILVUS_LOCALES,
  LEARN_MILVUS_TOPICS,
} = require('../src/utils/learn-milvus-seo');

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'src/docs');
const OUT_FILE = path.join(ROOT, 'public/llms.txt');
// Hand-written evaluation sections (why Milvus, when to use it, cost levers,
// benchmarks, ecosystem, adopters, versions, agent entry points, learning).
// They sit between the intro and the generated index; edit the Markdown file.
const EVALUATION_FILE = path.join(__dirname, 'llms-evaluation.md');
const ORIGIN = 'https://milvus.io';

/** Longest a generated description may be before it is trimmed to one sentence. */
const MAX_SUMMARY = 160;

/** Mirrors DOCS_MINIMUM_VERSION / IGNORE_VERSIONS in src/utils/docs.ts. */
const DOCS_MINIMUM_VERSION = 'v2.4.x';
const IGNORE_VERSIONS = ['v2.3.0-beta'];
const VERSION_REG = /^v\d+\.\d+\.(x|\d+)/;

/** Mirrors LanguageEnum in src/types/localization.ts (minus English). */
const TRANSLATED_LANGS = [
  'zh',
  'zh-hant',
  'ja',
  'ko',
  'de',
  'fr',
  'es',
  'it',
  'pt',
  'ru',
  'ar',
  'id',
];

// ---------------------------------------------------------------------------
// CURATED — hand-maintained prose. Everything else on this page is derived.
// ---------------------------------------------------------------------------

const CURATED = {
  /** Blockquote under the H1. */
  intro:
    "Milvus is an open-source (Apache 2.0) vector database for production AI: RAG, agent memory, semantic and hybrid search, recommendation, and multimodal retrieval. It runs from a laptop (Milvus Lite) to a distributed Kubernetes cluster that scales to 100 billion vectors, keeps cost down by serving data from object storage such as S3, and has been in production since 2019. Milvus was created by Zilliz and is a graduated project of the LF AI & Data Foundation. The fully managed version is Zilliz Cloud.",

  /**
   * Correctness rules that apply to any generated Milvus code. These exist
   * because models reliably get these specific things wrong from memory.
   */
  codingRules: [
    'Use the `MilvusClient` interface introduced in v2.4+. Do not use the legacy ORM API (`connections.connect()`, `Collection()`, `utility.list_collections()`) — it is deprecated and will be removed. If you find existing ORM code, advise upgrading the SDK and rewriting against `MilvusClient`.',
    'Check PyPI (`pip install --upgrade pymilvus`) or npm for the current SDK version rather than relying on a memorized version number.',
    'To change existing entities use `client.upsert()`. There is no `client.update()`. `upsert()` inserts when the primary key is absent and replaces the whole entity when it is present; use `client.insert()` only for data known not to collide.',
    "Schema changes depend on the server version, so check it first. v2.5.x and earlier: the schema is immutable — drop and recreate the collection. v2.6.x: add nullable scalar fields with `add_collection_field()` (nullable vector fields from v2.6.18). v3.0+: also add StructArray fields, add a BM25 or MinHash Function on an existing `VARCHAR` field (its output is backfilled; needs Storage V3), and drop user-defined fields. Added fields must be nullable. No version can change a field's data type or drop the primary key, partition key, clustering key, or the last vector field. See `add-fields-to-an-existing-collection.md`, which is authoritative here.",
    'Primary keys must be `DataType.INT64` or `DataType.VARCHAR`, must be unique across the whole collection including partitions, and cannot be composite.',
    'For BM25 full-text search, declare a BM25 Function that writes to a `SPARSE_FLOAT_VECTOR` field, with the analyzer set on the input text field. Declare it when creating the collection; only on v3.0+ with Storage V3 enabled can a BM25 Function be added later, and then only on a `VARCHAR` input (not `TEXT`).',
    'A vector field must be indexed and the collection loaded before it can be searched.',
    'Milvus 3.0.x ships with Storage V3 disabled. Before using external collections, snapshots, `TEXT` fields, or adding a Function to an existing collection, tell the user these require `common.storage.useLoonFFI=true` (see `storage-v3.md`); do not assume they work on a default 3.0 deployment.',
    'In `client.hybrid_search()`, each `AnnSearchRequest` takes exactly one query vector — use one request per vector field — and each search accepts exactly one ranker. Rankers cannot be chained.',
    'Search iterators (`with-iterators.md`) support basic ANN search only, not hybrid search.',
    'Both scalar and vector fields support `nullable=True`; only Array of Structs fields (and any field nested inside one) cannot be nullable. A nullable field cannot be a partition key, nullability is fixed at field creation, and a nullable vector field cannot be filtered with `IS NULL` / `IS NOT NULL`. See `nullable-and-default.md`, which is authoritative here.',
  ],

  /**
   * Notes attached to a section, keyed by its menu path. Only sections whose
   * behaviour is easy to get wrong need one.
   */
  sectionNotes: {
    'Get Started':
      'Start here for first-time setup: run the Quickstart against Milvus Lite, then pick a deployment mode and install an SDK.',
    'AI Tools':
      'Written specifically for AI coding agents. `agents_overview.md` is a drop-in AGENTS.md for Milvus; read it before generating Milvus code.',
    'User Guide > Schema & Data Fields':
      'Schema changes are heavily constrained — see the schema and primary-key rules above before designing a collection.',
    'User Guide > Insert & Delete':
      'Use `upsert()` to modify existing entities; `update()` does not exist.',
    'User Guide > Indexes':
      'A vector field must be indexed before the collection can be loaded and searched. AUTOINDEX is the right default for most workloads.',
    'User Guide > Search':
      'Load the collection before searching. Hybrid search has per-request constraints — see the rules above.',
    'Administration Guide':
      'Deploying, configuring, scaling, monitoring, and securing Milvus in production. Downgrading is not supported, except rolling 3.0 back to 2.6 before any feature that changes the data format (such as Storage V3) is used.',
  },

};

/** Fallback descriptions for the handful of docs with no `summary` frontmatter. */
const SUMMARY_FALLBACKS = {
  'glossary.md': 'Glossary of Milvus-specific terms and definitions.',
  'limit_collection_counts.md':
    'Configure the maximum number of collections in an instance.',
  'chunk_cache.md':
    'Tune the chunk cache that pre-loads data into memory ahead of search.',
  'scale-dependencies.md':
    'Scale the etcd, object storage, and message queue dependencies.',
  'configure_access_logs.md': 'Enable and configure Milvus access logging.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

/** Version strings sort naturally as `v2.10.x` > `v2.9.x` only when padded. */
const versionKey = v => {
  const [, major = 0, minor = 0] = v.match(/^v(\d+)\.(\d+)/) || [];
  return Number(major) * 1e4 + Number(minor);
};

/** Mirrors generateDocVersionInfo() in src/utils/docs.ts. */
const resolveDocVersions = () => {
  const { version: releaseVersion, released } = readJson(
    path.join(DOCS_DIR, 'version.json')
  );
  const minKey = versionKey(DOCS_MINIMUM_VERSION);

  let usable = fs
    .readdirSync(DOCS_DIR)
    .filter(name => VERSION_REG.test(name))
    .filter(name => name <= releaseVersion)
    .filter(name => !IGNORE_VERSIONS.includes(name))
    .filter(name => versionKey(name) >= minKey)
    .sort((a, b) => versionKey(b) - versionKey(a));

  if (released === 'no') usable = usable.filter(v => v !== releaseVersion);

  return { versions: usable, latest: usable[0] };
};

/** Index every English doc of a version by its filename, which is its page id. */
const indexDocFiles = siteDir => {
  const byId = {};
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) byId[entry.name] = full;
    }
  };
  walk(siteDir);
  return byId;
};

const unquote = value => {
  const trimmed = value.trim();
  const quoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  return quoted ? trimmed.slice(1, -1) : trimmed;
};

/** Minimum text worth keeping when dropping a trailing sentence fragment. */
const MIN_KEPT_SENTENCE = 40;

/**
 * A few docs ship a `summary` that was itself cut mid-sentence upstream (e.g.
 * milvus-webui.md ends on "You can "). Drop that dangling tail, but only when
 * a substantial complete sentence remains and the tail is the shorter half —
 * that keeps "Use mmap, e.g. for large collections" intact, where the period
 * belongs to an abbreviation rather than a sentence end.
 */
const dropTrailingFragment = text => {
  if (/[.!?:)]$/.test(text)) return text;

  const lastStop = Math.max(
    text.lastIndexOf('. '),
    text.lastIndexOf('! '),
    text.lastIndexOf('? ')
  );
  if (lastStop < 0) return text;

  const kept = text.slice(0, lastStop + 1);
  const tail = text.slice(lastStop + 1).trim();
  const worthCutting =
    kept.length >= MIN_KEPT_SENTENCE && tail.length < kept.length;
  return worthCutting ? kept : text;
};

/**
 * Compresses a doc summary to a single line. Prefers the first sentence, so
 * the description stays informative without carrying the whole abstract.
 */
const condense = raw => {
  const text = dropTrailingFragment(
    raw
      // A summary is rendered as the description of a list item, so a markdown
      // link inside it would nest and break the entry. Keep the label, drop the
      // target — a few integration docs link out from their summary.
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
  );
  if (!text) return '';
  if (text.length <= MAX_SUMMARY) return text;

  const firstSentence = text.match(/^.*?[.!?](?=\s|$)/);
  if (firstSentence && firstSentence[0].length <= MAX_SUMMARY) {
    return firstSentence[0].trim();
  }

  const clipped = text.slice(0, MAX_SUMMARY);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : MAX_SUMMARY)}…`;
};

const readSummary = (id, filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const summary = frontMatter && frontMatter[1].match(/^summary:\s*(.+)$/m);
  if (summary) {
    const condensed = condense(unquote(summary[1]));
    if (condensed) return condensed;
  }
  return SUMMARY_FALLBACKS[id] || '';
};

/** Resolves the newest published version directory for each API reference SDK. */
const resolveApiReferenceVersions = () => {
  const roots = ['API_Reference', 'API_Reference_MDX'];
  const latestBySdk = {};

  for (const root of roots) {
    const rootDir = path.join(DOCS_DIR, root);
    if (!fs.existsSync(rootDir)) continue;

    for (const sdk of fs.readdirSync(rootDir)) {
      const sdkDir = path.join(rootDir, sdk);
      if (!fs.statSync(sdkDir).isDirectory()) continue;

      const versions = fs
        .readdirSync(sdkDir)
        .filter(name => VERSION_REG.test(name))
        // The MDX tree stores About.mdx, but the route serves it as About.md
        // either way, so accept both when probing for a published version.
        .filter(name =>
          ['About.md', 'About.mdx'].some(entry =>
            fs.existsSync(path.join(sdkDir, name, entry))
          )
        )
        .sort((a, b) => versionKey(b) - versionKey(a));

      const [newest] = versions;
      if (!newest) continue;
      if (
        !latestBySdk[sdk] ||
        versionKey(newest) > versionKey(latestBySdk[sdk])
      ) {
        latestBySdk[sdk] = newest;
      }
    }
  }
  return latestBySdk;
};

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

const link = (label, url, description) =>
  description ? `- [${label}](${url}): ${description}` : `- [${label}](${url})`;

/**
 * Walks the menu tree, emitting a heading per menu node and a link per leaf.
 * Heading depth tracks menu depth so the site's own taxonomy survives, which
 * is what lets an agent find the right page without guessing.
 */
const renderMenu = (nodes, docsById, pathLabels, depth, out) => {
  const leaves = nodes.filter(n => n.id && n.id.endsWith('.md'));
  const groups = nodes.filter(n => n.children && n.children.length);

  for (const leaf of leaves) {
    const file = docsById[leaf.id];
    if (!file) {
      out.warnings.push(`menu id has no file: ${leaf.id}`);
      continue;
    }
    out.lines.push(
      link(leaf.label, `${ORIGIN}/docs/${leaf.id}`, readSummary(leaf.id, file))
    );
    out.count += 1;
  }
  if (leaves.length) out.lines.push('');

  for (const group of groups) {
    const groupPath = [...pathLabels, group.label];
    const key = groupPath.join(' > ');
    // Headings deeper than h6 are not valid Markdown; clamp and keep the label.
    out.lines.push(`${'#'.repeat(Math.min(depth, 6))} ${group.label}`);
    out.lines.push('');
    if (CURATED.sectionNotes[key]) {
      out.lines.push(CURATED.sectionNotes[key]);
      out.lines.push('');
    }
    renderMenu(group.children, docsById, groupPath, depth + 1, out);
  }
};

const renderUrlRules = (versions, latest) => {
  const pinnable = versions.filter(v => v !== latest);
  return `## URL rules

Read this before citing any milvus.io URL.

Documentation URLs take exactly one of these four forms:

    ${ORIGIN}/docs/<page-id>                    latest version (${latest}), English
    ${ORIGIN}/docs/<version>/<page-id>          pinned version
    ${ORIGIN}/docs/<lang>/<page-id>             translated, latest version
    ${ORIGIN}/docs/<lang>/<version>/<page-id>   translated, pinned version

- \`<page-id>\` always ends in \`.md\` — for example \`overview.md\`. The suffix is
  part of the route, not a file extension. \`${ORIGIN}/docs/overview\` is a 404;
  \`${ORIGIN}/docs/overview.md\` is the page.
- \`<version>\` is one of: ${pinnable.join(', ')}. Omit the segment entirely for
  the latest version (${latest}) — there is no \`/docs/${latest}/\` path.
- \`<lang>\` is one of: ${TRANSLATED_LANGS.join(', ')}. Omit the segment for English.
- API reference URLs are \`${ORIGIN}/api-reference/<sdk>/<version>/<page>.md\` and
  are versioned separately from the docs; see the API Reference section.
- Blog and Learn pages do not use a \`.md\` suffix.
- Learn Milvus uses \`/learn-milvus\` for the English home and
  \`/learn-milvus/<topic>\` for a topic. Translations put the language before
  the collection: \`/<lang>/learn-milvus\` or \`/<lang>/learn-milvus/<topic>\`,
  never \`/learn-milvus/<lang>\`. Supported languages: ${LEARN_MILVUS_LOCALES.filter(locale => locale !== 'en').join(', ')}.
  Published topics: ${LEARN_MILVUS_TOPICS.filter(topic => topic !== 'home').join(', ')}.
  Use the language matching the user's request when available. The English
  learning URLs are listed in the Learning and community section above; build a
  translated URL with this pattern. Do not append \`.md\`, invent a topic, or
  cite the unpublished Tradeoff dashboard.

**Unknown paths return a hard 404 — they do not redirect and they do not fall
back to a search page.** A URL that looks right but was never published is a
dead link for the reader.

Therefore: cite only page ids that appear in this file. If the page you need is
not listed, say it is not in the index rather than assembling a plausible slug
from the topic name. \`${ORIGIN}/sitemap.xml\` enumerates every published URL and
is the correct place to resolve anything this file does not cover.`;
};

const renderApiReference = apiVersions => {
  const sdks = [
    ['pymilvus', 'pymilvus', 'PyMilvus (Python)', 'Python SDK API reference.'],
    ['milvus-sdk-java', 'java', 'Java SDK', 'Java SDK API reference.'],
    ['milvus-sdk-go', 'go', 'Go SDK', 'Go SDK API reference.'],
    ['milvus-sdk-node', 'node', 'Node.js SDK', 'Node.js SDK API reference.'],
    [
      'milvus-restful',
      'restful',
      'RESTful API',
      'Language-agnostic HTTP API reference.',
    ],
    ['milvus-sdk-csharp', 'csharp', 'C# SDK', 'C# SDK API reference.'],
    ['milvus-sdk-cpp', 'cpp', 'C++ SDK', 'C++ SDK API reference.'],
    ['milvus-sdk-rust', 'rust', 'Rust SDK', 'Rust SDK API reference.'],
  ];

  const lines = ['## API Reference', ''];
  lines.push(
    'Each SDK is versioned independently of the docs — the newest published version differs per SDK, so do not copy a version segment between them.',
    ''
  );

  for (const [dir, urlSegment, label, description] of sdks) {
    const version = apiVersions[dir];
    if (!version) continue;
    lines.push(
      link(
        `${label} — ${version}`,
        `${ORIGIN}/api-reference/${urlSegment}/${version}/About.md`,
        description
      )
    );
  }
  lines.push('');
  return lines.join('\n');
};

// ---------------------------------------------------------------------------
// Current versions — fetched at build time, with the docs' release notes as a
// fallback so an offline build still produces a valid file.
// ---------------------------------------------------------------------------

const RELEASES_API = 'https://api.github.com/repos/milvus-io/milvus/releases?per_page=50';
const PYPI_API = 'https://pypi.org/pypi/pymilvus/json';
const FETCH_TIMEOUT_MS = 8000;

const fetchJson = async url => {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'milvus.io-llms-txt' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${url} returned HTTP ${res.status}`);
  return res.json();
};

const compareSemver = (a, b) => {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
};

/** Newest stable server release on each of the two newest minor lines. */
const fetchServerVersions = async () => {
  const newestByLine = new Map();
  for (const release of await fetchJson(RELEASES_API)) {
    if (release.draft || release.prerelease) continue;
    const m = /^v(\d+)\.(\d+)\.(\d+)$/.exec(release.tag_name);
    if (!m) continue;
    const line = `${m[1]}.${m[2]}`;
    const version = `${m[1]}.${m[2]}.${m[3]}`;
    const known = newestByLine.get(line);
    if (!known || compareSemver(version, known) > 0) newestByLine.set(line, version);
  }
  return [...newestByLine.values()].sort(compareSemver).reverse().slice(0, 2);
};

/** First row of each docs version's release-notes table: server and PyMilvus. */
const readReleaseNoteVersions = docVersions => {
  const server = [];
  let pymilvus;
  for (const docVersion of docVersions) {
    const file = path.join(DOCS_DIR, docVersion, 'site/en/release_notes.md');
    if (!fs.existsSync(file)) continue;
    const row = /^\|\s*(\d+\.\d+\.\d+)\s*\|\s*(\d+\.\d+\.\d+)\s*\|/m.exec(
      fs.readFileSync(file, 'utf8')
    );
    if (!row) continue;
    server.push(row[1]);
    pymilvus = pymilvus || row[2];
    if (server.length === 2) break;
  }
  return { server, pymilvus };
};

const resolveCurrentVersions = async (docVersions, warnings) => {
  let { server, pymilvus } = readReleaseNoteVersions(docVersions);
  try {
    const fetched = await fetchServerVersions();
    if (fetched.length) server = fetched;
  } catch (err) {
    warnings.push(`server versions from release notes (${err.message})`);
  }
  try {
    pymilvus = (await fetchJson(PYPI_API)).info.version || pymilvus;
  } catch (err) {
    warnings.push(`PyMilvus version from release notes (${err.message})`);
  }
  return { server, pymilvus };
};

const renderCurrentVersions = ({ server, pymilvus }) => {
  const checked = new Date().toISOString().slice(0, 10);
  const lines = [`## Current versions (checked ${checked})`, ''];
  if (server.length) {
    const [newest, ...older] = server;
    const olderText = older
      .map(v => `; **v${v}** on the ${v.split('.').slice(0, 2).join('.')} line`)
      .join('');
    lines.push(`- Milvus server: **v${newest}** (latest line)${olderText}.`);
  }
  if (pymilvus) lines.push(`- PyMilvus: **${pymilvus}**.`);
  lines.push(
    '- These change often. Check [Releases](https://milvus.io/docs/release_notes.md), PyPI or GitHub before pinning a version.'
  );
  return lines.join('\n');
};

const renderEvaluation = versions => {
  const text = fs.readFileSync(EVALUATION_FILE, 'utf8').trim();
  if (!text.includes('{{CURRENT_VERSIONS}}')) {
    throw new Error(`${EVALUATION_FILE} is missing the {{CURRENT_VERSIONS}} placeholder`);
  }
  return text.replace('{{CURRENT_VERSIONS}}', renderCurrentVersions(versions));
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const build = async () => {
  const { versions, latest } = resolveDocVersions();
  if (!latest) throw new Error('no usable docs version found');

  const siteDir = path.join(DOCS_DIR, latest, 'site/en');
  const menuFile = path.join(siteDir, 'menuStructure/en.json');
  if (!fs.existsSync(menuFile)) {
    throw new Error(`missing menu structure: ${menuFile}`);
  }

  const docsById = indexDocFiles(siteDir);
  const menu = readJson(menuFile);
  const apiVersions = resolveApiReferenceVersions();
  const versionWarnings = [];
  const currentVersions = await resolveCurrentVersions(versions, versionWarnings);

  const head = [
    '# Milvus',
    '',
    `> ${CURATED.intro}`,
    '',
    renderEvaluation(currentVersions),
    '',
    `This index is generated from the Milvus ${latest} documentation tree. Every URL below resolves to a published page.`,
    '',
    renderUrlRules(versions, latest),
    '',
    '## Rules for generating Milvus code',
    '',
    ...CURATED.codingRules.map(rule => `- ${rule}`),
    '',
  ];

  const out = { lines: [], warnings: versionWarnings, count: 0 };
  renderMenu(menu, docsById, [], 2, out);

  const body = [
    ...head,
    ...out.lines,
    renderApiReference(apiVersions),
  ];

  // Collapse the blank lines that heading/leaf blocks emit independently.
  const text = `${body
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;

  return { text, count: out.count, warnings: out.warnings, latest };
};

if (require.main === module) {
  build()
    .then(({ text, count, warnings, latest }) => {
      fs.writeFileSync(OUT_FILE, text, 'utf8');
      for (const warning of warnings) console.warn(`[llms.txt] ${warning}`);
      console.log(
        `[llms.txt] ${count} doc links from ${latest} -> public/llms.txt (${(
          Buffer.byteLength(text) / 1024
        ).toFixed(1)}KB)`
      );
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { renderUrlRules };
