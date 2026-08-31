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

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'src/docs');
const OUT_FILE = path.join(ROOT, 'public/llms.txt');
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
    'Milvus is an open-source, high-performance vector database designed for similarity search and AI applications. It supports billion-scale vector storage and search across deployment modes: Milvus Lite (embedded, for prototyping), Milvus Standalone (single-node, for small-scale production), and Milvus Distributed (Kubernetes, for enterprise scale). The primary SDK is PyMilvus for Python; Java, Go, Node.js, and RESTful SDKs are also available.',

  /**
   * Correctness rules that apply to any generated Milvus code. These exist
   * because models reliably get these specific things wrong from memory.
   */
  codingRules: [
    'Use the `MilvusClient` interface introduced in v2.4+. Do not use the legacy ORM API (`connections.connect()`, `Collection()`, `utility.list_collections()`) — it is deprecated and will be removed. If you find existing ORM code, advise upgrading the SDK and rewriting against `MilvusClient`.',
    'Check PyPI (`pip install --upgrade pymilvus`) or npm for the current SDK version rather than relying on a memorized version number.',
    'To change existing entities use `client.upsert()`. There is no `client.update()`. `upsert()` inserts when the primary key is absent and replaces the whole entity when it is present; use `client.insert()` only for data known not to collide.',
    "A collection schema is immutable in v2.5.x and earlier — to change it, drop and recreate the collection. From v2.6+ you may add scalar fields with `add_collection_field()`, but vector fields cannot be added and existing fields cannot be modified or removed. Changing a field's data type is not supported in any version. Check the server version before suggesting a schema change.",
    'Primary keys must be `DataType.INT64` or `DataType.VARCHAR`, must be unique across the whole collection including partitions, and cannot be composite.',
    'For BM25 full-text search, the BM25 function and its analyzer must be declared when the collection is created; they cannot be added later.',
    'A vector field must be indexed and the collection loaded before it can be searched.',
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
      'Deploying, configuring, scaling, monitoring, and securing Milvus in production. Downgrading across versions is not supported.',
  },

  /**
   * Site areas that are not part of the docs tree. Every URL here is verified
   * against public/sitemap-*.xml.
   */
  extraSections: [
    {
      heading: 'Interactive Learning',
      note: 'Browser-based visualizations of how the index and metric choices actually behave.',
      links: [
        [
          'Learn Milvus',
          `${ORIGIN}/learn-milvus`,
          'Index of the interactive index and metric visualizations.',
        ],
        [
          'IVF Visualized',
          `${ORIGIN}/learn-milvus/ivf`,
          'FLAT vs IVF search animation with a live nprobe/recall tradeoff.',
        ],
        [
          'HNSW Visualized',
          `${ORIGIN}/learn-milvus/hnsw`,
          'Walk through the HNSW layered graph with tunable M and ef.',
        ],
        [
          'DiskANN Visualized',
          `${ORIGIN}/learn-milvus/diskann`,
          "DiskANN's PQ-in-RAM beam search and SSD re-ranking, animated.",
        ],
        [
          'Similarity Metrics Visualized',
          `${ORIGIN}/learn-milvus/metric`,
          'How L2, cosine, and inner product change which neighbors rank as nearest.',
        ],
      ],
    },
    {
      heading: 'Sizing Tools',
      links: [
        [
          'Milvus Sizing Tool',
          `${ORIGIN}/tools/sizing`,
          'Estimate memory, disk, and node counts for a deployment.',
        ],
        [
          'Milvus Sizing Tool (Enterprise)',
          `${ORIGIN}/tools/sizing-enterprise`,
          'Sizing estimates for enterprise deployments.',
        ],
        [
          'Milvus Sizing Tool (v2.5.0)',
          `${ORIGIN}/tools/sizing-v250`,
          'Sizing calculator pinned to the v2.5.0 cost model.',
        ],
      ],
    },
    {
      heading: 'External Tools',
      note: 'Maintained outside milvus.io; these are the canonical repositories.',
      links: [
        [
          'Attu (Milvus GUI)',
          'https://github.com/zilliztech/attu',
          'Desktop/web GUI for browsing collections and running queries.',
        ],
        [
          'Milvus VTS',
          'https://github.com/zilliztech/vts',
          'Vector Transmission Service for migrating data between collections.',
        ],
      ],
    },
    {
      heading: 'Other Site Sections',
      note: 'These areas hold thousands of pages and are not enumerated here. Do not guess a slug inside them — resolve one through https://milvus.io/sitemap.xml or the section index below.',
      links: [
        [
          'Blog',
          `${ORIGIN}/blog`,
          'Release announcements, engineering deep dives, and benchmarks. Article URLs are `/blog/<slug>` with no `.md` suffix.',
        ],
        [
          'AI Quick Reference',
          `${ORIGIN}/ai-quick-reference`,
          'Short Q&A pages on vector search and AI topics, at `/ai-quick-reference/<question-slug>`.',
        ],
        [
          'Learn AI and Vector DB',
          `${ORIGIN}/learn-ai-and-vectordb`,
          'Long-form explainers on vector databases and AI infrastructure.',
        ],
        [
          'Use Cases',
          `${ORIGIN}/use-cases`,
          'Production use cases and customer stories.',
        ],
        [
          'Milvus Demos',
          `${ORIGIN}/milvus-demos`,
          'Live demo applications, including reverse image search.',
        ],
        [
          'Bootcamp',
          `${ORIGIN}/bootcamp`,
          'Hands-on notebooks and end-to-end example projects.',
        ],
        [
          'Community',
          `${ORIGIN}/community`,
          'Contributing, governance, and community channels.',
        ],
      ],
    },
  ],
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
- Blog, AI Quick Reference, and Learn pages do not use a \`.md\` suffix.

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
// Main
// ---------------------------------------------------------------------------

const build = () => {
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

  const head = [
    '# Milvus',
    '',
    `> ${CURATED.intro}`,
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

  const out = { lines: [], warnings: [], count: 0 };
  renderMenu(menu, docsById, [], 2, out);

  const extras = CURATED.extraSections.flatMap(section => [
    `## ${section.heading}`,
    '',
    ...(section.note ? [section.note, ''] : []),
    ...section.links.map(([label, url, description]) =>
      link(label, url, description)
    ),
    '',
  ]);

  const body = [
    ...head,
    ...out.lines,
    renderApiReference(apiVersions),
    ...extras,
  ];

  // Collapse the blank lines that heading/leaf blocks emit independently.
  const text = `${body
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;

  return { text, count: out.count, warnings: out.warnings, latest };
};

const { text, count, warnings, latest } = build();
fs.writeFileSync(OUT_FILE, text, 'utf8');

for (const warning of warnings) console.warn(`[llms.txt] ${warning}`);
console.log(
  `[llms.txt] ${count} doc links from ${latest} -> public/llms.txt (${(
    Buffer.byteLength(text) / 1024
  ).toFixed(1)}KB)`
);
