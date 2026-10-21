# Milvus SEO landing pages

Imported from the owner's landing handoff and its revised
`milvus-landing-studio-2026-10-20/content` materials. The JSON files in
`en/` and `zh/` are the editable source for ten themes in two languages. The
site renders them as native Next.js static pages, with four navigable comparison
and solution indexes. The standalone HTML in the handoff is a visual reference,
not a production route.

## Publishing contract

- Each page has one H1, a self-canonical, reciprocal English/Simplified Chinese
  alternates, an English x-default, visible FAQ content matching FAQPage JSON-LD,
  a breadcrumb pointing to a real index, and local social/diagram assets.
- All 20 pages and four indexes are advertised by the sitemap. `reviewedOn` is
  the actual content review date; a build does not advance that date.
- Header and footer link visibly to the solution and comparison indexes. Related
  pages and concept references use actual canonical paths. This change does not
  modify the curated AI Reference articles or the separate docs/blog submodules.
- Metadata, copy and code are React-escaped. SVGs are local, independently styled,
  valid XML; there are no inline scripts in the imported diagrams.
- Editorial `notes`, `research`, keyword plans and paid-campaign seed suggestions
  stay on the server; they are excluded from page props and browser bundles.
- Reference drafts' noindex directive is replaced by index,follow on these routes.
  Deploy-level preview indexing controls remain the environment's responsibility.
  Deployment alone is not evidence of search-engine indexing or ranking gains.

## Review changes

- The owner confirmed that RLS is available **only in the enterprise edition**.
  English/Chinese descriptions, feature copy, tables, FAQs and diagram labels
  distinguish this from open-source Milvus RBAC. A public RLS documentation link
  can be added when supplied; the page does not link to a guessed document.
- A partition key reduces the data scanned; it does not independently enforce a
  tenant boundary. The agent page requires a tenant filter on every request.
- Architecture prose no longer promises that ingestion and search never share
  machines, or that new data is visible independently of consistency settings.
- All 20 figures have their own SVG namespace and styles. Figures are generated
  from reviewed JSON, so enterprise qualifications and architecture corrections
  also appear in the diagrams, independently of the handoff's older HTML renders.
- Comparison recommendations describe architecture and operational tradeoffs, rather than presenting a small/stable corpus as a hard limit of Qdrant.
- Every benchmark chart links to the underlying VectorDBBench results. QPS,
  P99 and recall were checked against the public files on 2026-10-21. The small
  `benchmark-evidence.json` ledger records matching configurations and source
  hashes; source URLs can change, so refresh the ledger and copy together.
  The full-text chart labels Zilliz Cloud rather than open-source Milvus, includes
  the actual run configuration, and distinguishes serial P99 from concurrent QPS.
- Fixed two invalid documentation source paths, filled the hybrid example with
  a document before searching, and bounded the external-refresh polling loop.
  Code samples were syntax checked, not executed against a live Milvus cluster.
- Native route switching loads the matching i18n resources before changing the
  header/footer locale. Nginx keeps EN/ZH landing URLs independent of the visitor language cookie; other routes are unchanged. CSS is scoped to these pages. There is no second GTM or
  GA4 installation. CTA/copy/story events are sent once to the existing dataLayer;
  GTM still needs matching GA4 event mappings if these names are not configured.

### Landing click measurement

- CTA style does not select its event. Each detail page has a single compact
  Cloud banner after sources and related links, with `cta_final_click`.
  Former in-content benchmark banners and the large final CTA are removed.
- Every custom event includes `landing_page`, `landing_topic`, `cta_location`,
  `cta_destination`, `entry_button`, and a query/fragment-free `link_url`.
  The destination is derived from the actual URL, not from button styling.
- Hero Cloud signup clicks retain `cta_zilliz_signup_click` with location `hero`.
  Final clicks do not also emit that generic event: count signup-button
  clicks across locations by `cta_destination=cloud_signup` to avoid double counting.
- `copy_code_snippet` is emitted only after clipboard success. A denied/failed
  copy emits `copy_code_snippet_failed`; no code text is sent to analytics.
- These are interaction events, not successful registration, activation or ICP
  conversions. Configure GTM triggers/GA4 parameters for the event names and
  fields above separately. Client dataLayer emission does not prove receipt in
  GA4; the existing deferred GTM loader can also lose queued events if a visitor
  leaves before GTM initializes. This change does not alter the global loader,
  consent settings or Cloud attribution forwarding.

The handoff's suggested zilliz.com redirects, cross-domain GA4 configuration,
paid campaigns and third-party docs edits are **not** applied by this PR. In
particular, don't redirect an existing comparison until the old/new intents,
organic traffic and destination availability have been checked.

### Revised capability coverage

- Six solution topics now include deployment and operations choices, index and
  quantization tradeoffs, the write/search lifecycle, consistency, embedding
  functions, agent memory and framework integration, and Lance/Iceberg external
  collections with refresh and Spark/Ray/DuckDB roles.
- Added English/Chinese pgvector and LanceDB comparisons. Together
  with Qdrant and Elasticsearch/OpenSearch, the comparison indexes now contain
  four topics. Each page distinguishes product editions and describes when the
  other system fits; adding a machine or corpus size alone is not a hard product
  boundary.
- The pgvector performance section uses one side-by-side table for Milvus,
  Zilliz Cloud and pgvector, including unfiltered and filtered results. Instance,
  configuration and the historical pgvector date stay visible; the table is not
  a same-condition ranking. The Qdrant and Elasticsearch/OpenSearch charts retain
  their published configuration labels.
- Standalone still needs its data infrastructure; embedded Woodpecker does not
  mean etcd and object storage vanish. Moving from Postgres also requires schema,
  index and query changes even when embeddings can be reused.
- LanceDB OSS is an embedded library; Cloud/Enterprise serving architectures are
  separate products, not proof of an OSS corpus ceiling.
- The revised handoff's analytics and redirect suggestions are not configuration
  instructions: there is no second analytics installation, no click-as-signup
  conversion, and no automatic cross-site redirect in this update.

## Verification

```
node --test tests/seo-landings.test.cjs tests/landing-tracking.test.cjs tests/landing-locale.test.cjs tests/ai-reference-catalog.test.cjs
pnpm exec tsc --noEmit --incremental false
LANDING_TEST_URL=http://127.0.0.1:8033 node scripts/smoke-seo-landings.js
```

The HTTP smoke checks server-rendered metadata, all routes and local assets; it
does not prove browser interactions or a deployment. Use a browser to check both
languages at desktop/mobile widths, language switching, FAQ disclosure, code
copying and visible diagrams. FAQ structured data is descriptive; it is not a
promise that Google will show an FAQ rich result.

### Preview refinement

- Withdraw the English/Chinese Vespa and Weaviate landing pages, their local assets,
  related links and sitemap entries. Removed routes return 404 without an unrelated redirect.
- The pgvector page removes the standalone benchmark charts, external benchmark
  survey and AWS scan-configuration section at the owner's request. All retained
  table metrics are formatted from the existing benchmark evidence ledger.
- The LanceDB page now explains Lance format versus LanceDB, Milvus external
  collections over Lance, embedded/distributed deployment and serving tradeoffs.
  Cloud external collections are qualified as Public Preview and on-demand only.

- The pgvector migration/coexistence section and its section-navigation entry are removed in both languages.
