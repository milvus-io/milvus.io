# /index2 Launch-Gate Handoff

**Date:** 2026-04-20
**Branch:** feat/home2-agent-redesign
**Status:** Preview-ready. All 9 sections implemented and smoke-tested.
           `/index2` renders behind `<meta robots="noindex, nofollow">`.

## Still required before public launch

1. **Agent-ready CLI command** — Hero primary CTA and Final CTA Python card
   both render the literal placeholder `⚠️ PLACEHOLDER: Agent-ready CLI
   command TBD`. Decide among candidates (`uvx mcp-server-milvus`,
   `pip install "pymilvus[model]"`, `npx create-milvus-app`, dual-tab
   Python/MCP). Update BOTH `hero.ctaPlaceholder` and `finalCta.python.body`
   in `src/i18n/en/home2.json` with the final string.

2. **Attu screenshot asset** — replace `/public/images/home2/hero-attu-search.svg`
   (placeholder SVG with grey rectangle) with the real Attu "Vector Search
   Results" PNG. Update the `<img src>` in
   `src/parts/home2/heroSection2/index.tsx` if you change the extension.

3. **Verify every pymilvus / MCP code snippet.** Run each against a live
   Milvus 2.6 / Zilliz Cloud instance:
   - `src/parts/home2/capabilityPillars/const.ts` (4 snippets)
   - `src/parts/home2/codeWalkthrough/const.ts` (4 snippets)
   Rewrite any that don't work as published.

4. **Architecture diagram.** `src/parts/home2/architectureSection/diagram.tsx`
   ships a simplified static SVG with inline English labels. Replace with
   the final animated SVG/Lottie asset per spec §5.4, and externalize the
   text labels into `home2.json` (a TODO(i18n) comment tracks this).

5. **Numeric claims — replace `XX` placeholders with verified numbers:**
   - `hero.subtitle` says "100B+ vectors" — verify or substitute "billion-scale".
   - `architecture.benchmark.latency`: `Sub-XX ms p99`
   - `architecture.benchmark.cost`: `~XX% lower infra cost vs 2.5`
   - `production.placeholders.customers`: `XX+`
   - `production.placeholders.scale`: `XX billion`
   - `community.contributorsPlaceholder`: `XXX+`

6. **Ecosystem Matrix logo expansion.** Agent Frameworks has only 1 logo
   (MemGPT) and Protocols is empty. Both render the "⚠️ Coming soon"
   placeholder. Need at minimum 3 logos each before public launch:
   - Agent Frameworks: LangGraph, CrewAI, AutoGen, Mastra, Pydantic AI
   - Protocols: MCP, A2A
   Add `MILVUS_INTEGRATION_*_LINK` entries in `@/consts/links` and logo
   assets under `/public/images/home/` (or `/home2/`) first.

7. **Testimonials refresh.** Spec §5.7 explicitly keeps the existing three
   testimonials (Nandula / Bhargav / Igor) which do not speak to the
   Agent-era narrative. If any Agent-framework team can be sourced for
   a refreshed quote, swap one in.

8. **MCP server repo URL.** Verify the `learnMoreHref` for the MCP pillar
   (`src/parts/home2/capabilityPillars/const.ts:48`) points at the official
   repo (currently `https://github.com/zilliztech/mcp-server-milvus`).

9. **Doc-link targets.** Verify all `learnMoreHref` values in
   `src/parts/home2/capabilityPillars/const.ts` route correctly on
   milvus.io. Specifically:
   - Hybrid Search — currently `/docs/multi-vector-search.md`
   - Embedding Functions — currently `/docs/embedding-function-overview.md`
   - Agent Memory — currently `/docs/partition-key.md`
   (`.md` suffix may need removal depending on routing.)

## Code-review follow-ups (not launch blockers, but worth tracking)

- **Shared community stats.** `25M+` / `35K+` strings are duplicated
  across Hero (props default), Production (METRICS), and Community
  (statRow) — three places to update in lockstep when real numbers tick
  over. Consider extracting a shared `src/parts/home2/consts/community-stats.ts`.
- **Diagram i18n.** `src/parts/home2/architectureSection/diagram.tsx`
  has hardcoded English text nodes; externalize when the final animated
  asset ships (TODO(i18n) comment tracks this).
- **Syntax highlighting parity.** `codeWalkthrough` and `capabilityPillars`
  render `<pre><code>` without syntax highlighting. The original
  `home/codeExampleSection` uses `highlight.js`. If visual parity matters,
  add hljs.

## Smoke test coverage

`tests/index2.smoke.test.js` has 10 describe blocks covering the shell
and all 9 sections. All passing at HEAD.

## Hard constraints verified

- No modifications to `src/parts/home/**`.
- No modifications to `src/pages/index.tsx`.
- No modifications to any `src/i18n/<locale>/home.json`.
- No `milvus.db` / Milvus Lite promotion in new code.
