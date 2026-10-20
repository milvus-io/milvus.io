# AI Quick Reference editorial scope

This collection explains core concepts required to understand, evaluate, and
operate vector retrieval, including lake integration, Milvus components, agent
workflows, and data curation. It is organized as a reading path, with links from
concepts to related concepts, implementation guides, and primary sources.

The curated set contains 119 articles across ten topics. The original 36
canonical URLs remain stable. Fourteen duplicate definitions redirect to the corresponding
canonical concept. Other legacy URLs return 404; they are not redirected to an
unrelated homepage. The legacy public CSV is removed, so replacing that export
cannot silently republish the retired catalog.

## Content source

- `pages/*.md`: one concept per file, with slug, title, topic, and reading order
  in front matter. A short filename is independent of the historical URL slug.
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

## Model and framework review

The MTEB article uses a dated Multilingual v2 snapshot, complete task coverage,
and an explicitly stated Mean Task sort. This is not the backend rank field or
a reranker ranking. Hosted/newer/multimodal candidates and reranker families
are documented separately. Model cards with non-commercial or custom terms
are identified; open weights are not treated as production permission.
The articles are documentation-reviewed; no local model benchmark or paid
inference run is claimed. Framework and server compatibility must be checked
for the deployed versions.
