# AI Quick Reference editorial scope

This collection explains core concepts required to understand, evaluate, and
operate vector retrieval, including lake integration, Milvus components, agent
workflows, and data curation. It is organized as a reading path, with links from
concepts to related concepts, implementation guides, and primary sources.

The curated set contains 113 articles across ten topics (consolidated from an
earlier 132-entry draft; see "Consolidation and search-informed rewrite" below).
The original 36
canonical URLs remain stable. Fourteen duplicate definitions redirect to the corresponding
canonical concept. Other legacy URLs return 404; they are not redirected to an
unrelated homepage. The legacy public CSV is removed, so replacing that export
cannot silently republish the retired catalog.

## Content source

- `pages/*.md`: one concept per file, with slug, title, topic, and reading order
  in front matter. A short filename is independent of the historical URL slug.
- Optional `demo` and `demoDescription` front matter preserves a reviewed demo
  entry point. `demo` must match a supported card type; its description is required.
- `publication.json`: explicit publication decisions, content hashes, checked
  sources, related concepts, and direct merge targets for legacy URLs.
- `topics.json`: ten topic groups and their implementation starting points.

The page renderer, list API, and sitemap use the same validated catalog. The
Docker build and runtime stages both include `content/`.

## Publishing checklist

1. Identify a distinct reader task within the core scope. Extend or consolidate
   an existing article when the intent overlaps; do not create alternate wording
   merely to target another query.
2. Explain the concept, its limits, a concrete decision or workflow, and how to
   check the result. Avoid unsupported product superlatives and volatile pricing
   or benchmark claims without a dated, reproducible source.
3. Check primary sources against the relevant version. Include descriptive links
   to implementation guidance and related concepts. A valid link alone does not
   establish that a claim is supported. Retire obsolete year-specific news and
   tool-version answers. Retain an evergreen concept only after rewriting and
   checking its substantive claims; changing a displayed date is not a review.
   Clearly distinguish architecture patterns from released product capabilities,
   and state material version requirements and integration limits.
4. Update the article and its publication record together. The content hash is
   SHA-256 of `title + '\n' + body + '\n' + topic`, where body is the trimmed
   Markdown content with one final newline. Mark the source-check date and
   sources only after checking the substantive claims.
   For articles with a demo, append `\n + demo + \n + demoDescription` to the
   hashed content so demo changes also require review.
5. Run `pnpm validate:ai-reference` and `pnpm test:ai-reference`, then inspect the
   rendered article, topic navigation, API results, and sitemap. Check all changed
   links and ensure internal links point directly to canonical retained pages.
6. Use a reviewed PR to `preview`. The manifest must not be automatically
   regenerated from a bulk content export to bypass the source check.

The hash prevents an unreviewed body change from being published silently; it
does not replace technical review. New content must be source-checked. There is
no grandfathered publication mode for the legacy collection.

## Rollout and recovery

After deployment, verify the retained URLs, 308 redirects, retired 404s, list API,
sitemap, and absence of `/assets/milvus-faq.csv`. Check CDN caches and generated
artifacts for stale pages. Preserve the pre-change Git revision and URL decision
manifest as evidence and for rollback.

This code change does not submit a Google reconsideration request or establish
that a manual action has been lifted. Review the complete affected scope and
production behavior before submitting reconsideration. Track search visibility
and qualified downstream activity separately from the deployment check.

## Examples, illustrations, and implementation paths

Each retained article includes concrete examples (worked calculations, schema or
code snippets, or a decision walkthrough) and links to practical follow-up
resources. Articles do not share a fixed section template; structure follows the
reader's question. Examples and numeric calculations are illustrative; they are
not customer measurements or local model benchmark results. Customer stories are
linked as additional reading without implying equivalent outcomes.

Twenty-five original concept diagrams appear across 70 articles. English and Chinese SVG
variants live in `public/images/ai-reference/`. They are schematics, not measured
plots. Keep descriptive alt text, accessible SVG titles/descriptions, and visible
explanations of representation, data ownership, or stage boundaries. The content
validator checks local image paths and assets. Reference rendering passes an empty
documentation version so root-relative images are not prefixed with `/docs/`.

Retired known URLs render a helpful page linking to the curated reference,
Quickstart, and documentation while returning HTTP 404. Duplicate redirects remain
direct; unknown URLs still use the site's normal not-found response. The HTTP smoke
test checks actual response codes, redirects, image URLs, and retained demo cards.

## Model and framework review

The MTEB and MMEB articles explain how the benchmarks work and link to the live
leaderboards; they no longer embed dated score tables or rankings, which go stale.
`mteb-snapshot-2026-10-20.json` and `mmeb-snapshot-2026-10-20.json` remain as
historical review evidence only. Hosted/newer/multimodal candidates and reranker
families are documented separately, by family rather than pinned version. Model cards with non-commercial or custom terms
are identified; open weights are not treated as production permission.
The articles are documentation-reviewed; no local model benchmark or paid
inference run is claimed. Framework and server compatibility must be checked
for the deployed versions.

## Multimodal and library evidence

Matching model names across benchmark versions do not prove matching checkpoints.
The SDK support matrix is derived from the released pymilvus.model 0.3.4
wheel with its PyPI SHA-256 verified. It describes 23 explicit exported classes
and one default alias, not universal model compatibility or inference tests.
Client wrappers, server Functions, and rank fusion are documented separately.

## Consolidation and search-informed rewrite

The 132-entry draft was consolidated to 113 articles. Thirteen near-duplicate or
thin articles were merged into the canonical page for the same concept, and their
slugs are recorded as `merged` in `publication.json`; six articles outside the
vector-search scope were retired. Internal component pages (Streaming Node,
Woodpecker, Talon) were folded into the architecture overview, and single-vendor
model pages into the shared model catalogs.

Every retained article was then rewritten against the current top search results
for its target question: the results were used to find missing subtopics and
recurring questions, never as text to copy. Milvus-specific claims were checked
against milvus.io docs; framework code was checked against current package sources
but not executed against a live cluster. Links to competing vector databases are
not used.

Precision rules that came out of review, to keep when editing:

- Range search returns at most `limit` results, and only neighbors the ANN index
  visits. Never describe it as returning every record in a band, and do not treat
  its hit count as a complete density measurement.
- Upsert without `partial_update=True` (Milvus 2.6.2+) replaces the whole entity.
  An upsert is not an audit log; keep decision history separately.
- Fusion rankers (RRF, weighted) do not enforce per-modality thresholds. When a
  rule requires two signals to agree, keep both scores and intersect.
- Before multiplying or blending scores, fix the direction: COSINE/IP can be
  negative, L2 is lower-is-better. Exclude invalid facts by filter, not by score.
- A recall plateau under rising `ef` has several causes (ground truth, graph,
  final scoring, routing); isolate them before blaming compression.
- A collection snapshot freezes data and index files, not ANN result order.

The dated review ledgers below describe the earlier 130/132-entry drafts and are
kept as history; current hashes and sources live in `publication.json`.

## Claim-level review, 2026-10-20 (historical)

`semantic-review-2026-10-20.json` records the reading of all 130 retained English
bodies and examples, the original and reviewed content hashes, sources, and
34 articles corrected or clarified. Unchanged entries mean no additional factual
correction was identified in this review, not certification that they are error-free.
Chinese draft corrections are synchronized in the local review artifact.

Distinguish modality alignment from preference learning, similarity from confidence,
and retrieval improvements from business outcomes. Exact evaluation must use the
same eligible corpus as the ANN run. Keep development selection separate from final
test evaluation, and distinguish curation exclusion from erasure and relevance
labels from access-control rules.

Review illustrations for the claim they communicate, not just whether their files
resolve: remove eight irrelevant placements and replace misleading multi-vector
diagrams on generic multimodal/WeMM pages. Model/version and source snapshots do
not establish executed inference, deployed feature availability, or measured gains.

## Foundation revisions and multi-vector entry (historical)

The earlier 132-entry draft included one core multi-vector article, revised foundation and
late-interaction entries, a new FAISS introduction, and expanded index/quantization
primers. See the dated review ledgers for current hashes and sources on top of the
historical 130-entry claim review.
Explain RAG and Agent Memory integration, dense/sparse representation generation,
cosine/IP/squared L2 geometry, CLIP alignment, and MaxSim versus candidate search.
MUVERA is a fixed-dimensional encoding approach, not an embedding model or a
replacement name for MaxSim; concrete strategy configuration needs release checks.

## Retrieval foundations revision

The semantic/keyword article now links directly to hybrid retrieval; the BM25 article
explains term frequency, inverse document frequency, length normalization, and
lexical matching; the ANN introduction distinguishes the kNN result task from exact
and approximate methods, with hashing, graph, and IVF families. It also states that
Milvus `MINHASH_LSH` is specific to binary MinHash/Jaccard signatures. See the
2026-10-20 supplementary retrieval review ledger for the content hashes and sources.

## Index-family and quantization primer

The ANN overview links to an added FAISS introduction and distinguishes library,
search structure, and vector representation. The quantization article now defines
SQ8, PQ, PRQ, and RaBitQ, estimates vector-payload memory, and explains why those
ratios do not equal total index or service-memory savings.
