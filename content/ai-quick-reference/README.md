# AI Quick Reference editorial scope

This collection explains core concepts required to understand, evaluate, and
operate vector retrieval, including lake integration, Milvus components, agent
workflows, and data curation. It is organized as a reading path, with links from
concepts to related concepts, implementation guides, and primary sources.

The curated set contains 131 articles across ten topics. The original 36
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

Each retained article includes a topic-specific example to test and links to
practical follow-up resources. Examples and numeric calculations are illustrative;
they are not customer measurements or local model benchmark results. Customer
stories are linked as additional reading without implying equivalent outcomes.

Twenty-five original concept diagrams cover 71 articles. English and Chinese SVG
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

The MTEB article uses a dated Multilingual v2 snapshot, complete task coverage,
and an explicitly stated Mean Task sort. This is not the backend rank field or
a reranker ranking. Hosted/newer/multimodal candidates and reranker families
are documented separately. Model cards with non-commercial or custom terms
are identified; open weights are not treated as production permission.
The articles are documentation-reviewed; no local model benchmark or paid
inference run is claimed. Framework and server compatibility must be checked
for the deployed versions.

## Multimodal and library evidence

MMEB-V2 public-file scores are pinned separately from MMEB-V3 and newer
WeMM model-report numbers; matching names do not prove matching checkpoints.
The SDK support matrix is derived from the released pymilvus.model 0.3.4
wheel with its PyPI SHA-256 verified. It describes 23 explicit exported classes
and one default alias, not universal model compatibility or inference tests.
Client wrappers, server Functions, and rank fusion are documented separately.

## Claim-level review, 2026-10-20

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

## Foundation revisions and multi-vector entry

The current 131-entry set adds one core multi-vector article and revises six
foundation/late-interaction entries. See `foundation-review-2026-10-20.json` for
current hashes and sources on top of the historical 130-entry claim review.
Explain RAG and Agent Memory integration, dense/sparse representation generation,
cosine/IP/squared L2 geometry, CLIP alignment, and MaxSim versus candidate search.
MUVERA is a fixed-dimensional encoding approach, not an embedding model or a
replacement name for MaxSim; concrete strategy configuration needs release checks.
