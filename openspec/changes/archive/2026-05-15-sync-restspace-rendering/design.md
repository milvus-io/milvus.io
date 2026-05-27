## Context

`RestSpace.tsx` is a Next.js/TSX port of zdoc's Docusaurus `src/components/RestSpecs/index.js`. The two have diverged. Upstream rendering fixes/improvements live in commits `b684281c` (harden + rendering bug fixes), `74977dc4`/`a9581e35` (docs/restful updates), and `5bfc4afa` (apifox `x-admonition`/`x-base-urls`/deprecated marking).

Constraints:
- milvus.io is Next.js; upstream is Docusaurus. `useDocusaurusContext`/`siteConfig.customFields.planeConfig` and `@theme/Admonition`/`@theme/CodeBlock` have no equivalent here. The port already uses local `Admonition.tsx`, `CodeBlock.tsx`, `BaseURL.tsx`.
- milvus.io renders OSS Milvus REST specs with `target` typically `milvus` (not `zilliz`). Default credential is `root:Milvus`.
- The local component additionally has a `TryItOut` panel and "Try it out" button not present upstream — these must be preserved.

## Goals / Non-Goals

**Goals:**
- Port the page-rendering-relevant upstream changes so multi-option schemas, localized text, admonitions, and curl examples render correctly.
- Keep changes additive and gated on optional fields (`x-i18n`, `x-admonition`) so existing specs render unchanged.
- Preserve milvus.io-specific behavior: `root:Milvus` token, local `Admonition`/`CodeBlock`/`BaseURL`/`TryItOut`.

**Non-Goals:**
- `x-base-urls` multi-base-URL tab UI and `plane-config`/`siteConfig` plumbing (C-group). Confirmed inert on milvus.io: gated behind `target === 'zilliz'` + a Zilliz-Cloud-only spec field + Docusaurus config.
- Changing the Zilliz-Cloud token (`db_admin:xxxxxxxxxxxxx`); milvus.io keeps `root:Milvus`.
- Refactoring `utils.ts` `isControlPlane`/`getBaseUrl` signatures (only needed by C-group).

## Decisions

**1. `getOptionValue` helper in `AnyOf`/`OneOf` (port upstream verbatim).**
Upstream maps `responses`/`requestBody` tab labels to `OPTION 1`, `OPTION 2`, … and passes an explicit `optionValue` prop into `Tab`. The local code derives the selected value from the label, so `handleMultipleRequests`/`handleMultipleResponses` (which set `selectedRequest`/`selectedResponse` to `OPTION N`) never match, leaving example tabs desynced from the schema tab. Adopting `getOptionValue` + `optionValue` is the minimal correct fix. Alternative (rework the `selectedRequest` contract) rejected as larger and divergent from upstream.

**2. `x-i18n` resolution mirrors upstream exactly, per call site.** Add `translatedDescription = x_i18n?.[lang]?.description ?? description` in `Param`/`AnyOf`/`OneOf`; resolve `obj["x-i18n"]?.[lang]?.description` in `Items` child dispatch and `Tab`; resolve `x-i18n[lang].example` in `Primitive`. Pass `x_i18n` prop from `RestSpecs` into header `Param` and into `AnyOf`/`OneOf` for requestBody/responses, matching upstream prop wiring. Falls back to existing behavior when `x-i18n` absent.

**3. `Tab` undefined-content guard.** Add `if (!content) return null` at the top of `Tab`, matching upstream. Pure defensive rendering fix.

**4. Reuse local `Admonition.tsx` for `Admonitions`.** Upstream's `Admonitions` wraps Docusaurus `@theme/Admonition`. The local `Admonition.tsx` already provides a compatible API (`type`, `icon`, `title`, `children`). Implement a local `Admonitions` map over `x-admonition` items resolving `x-i18n` title/content, render at spec level, in `Param`, in `Primitive`, and a `deprecated` danger admonition — wiring matches upstream, component is the local one. Pass an `icon` (local `Admonition` requires it; upstream omits it) — use a sensible default per type.

**5. Enums `<em>` → `_`.** Change the local `.replace(/<\/?em>/g, '-')` to `'_'` to match upstream rendered enum values.

**6. `Request-Timeout: 5` header** appended in `ExampleRequests` only when `headersExample` is truthy, exactly as upstream, so the displayed curl matches.

**7. Leave `ExampleRequests`/`ExampleResponses` empty-`validKeys` handling as-is.** Local already guards this (commit `cd50826b`); upstream's `defaultValue = '' ` approach is functionally equivalent. Not re-touched to avoid regressing the existing local fix.

## Risks / Trade-offs

- [Local `Admonition` requires an `icon` prop that upstream doesn't supply] → Provide a default icon per `type` (e.g. info → 📘, danger → ⚠️) in the local `Admonitions` wrapper; does not change data contract.
- [`x_i18n` prop threading touches many call sites] → Mirror upstream wiring 1:1; behavior is a no-op when `x-i18n` is absent, so existing specs are unaffected. Verify by rendering an existing spec page before/after.
- [`getOptionValue` changes default selected tab value] → It only changes the *internal* selected token to `OPTION N`, which is exactly what `handleMultiple*` already expects; net effect is correcting today's desync, not introducing new state.
- [Divergence from upstream for `Admonition` icon and preserved `TryItOut`] → Documented intentional adaptations; keep a comment noting the milvus.io-specific deltas.
