## Why

The `RestSpace` component (`src/components/mdx/rest-space/RestSpace.tsx`) is a Next.js/TSX port of zdoc's Docusaurus `RestSpecs` component. The upstream component received several page-rendering fixes and improvements (commits `b684281c`, `74977dc4`, `5bfc4afa`) that the port has drifted from, causing incorrect tab selection for multi-option request/response bodies, potential crashes on undefined tab content, missing localized (`x-i18n`) text in several places, and no support for inline admonitions. This change syncs only the page-rendering-relevant updates so milvus.io renders REST API specs correctly and consistently with upstream.

## What Changes

- **AnyOf/OneOf option mapping**: Map `responses`/`requestBody` tab labels to stable `OPTION N` values via a `getOptionValue` helper so the selected request/response example stays in sync with the chosen schema tab.
- **Tab undefined-content guard**: Return `null` when a `Tab`'s `content` is undefined instead of dereferencing it (prevents render crashes).
- **`x-i18n` localized text**: Resolve `x-i18n[lang].description` for `AnyOf`/`OneOf`/`Items`/`Tab`, `x-i18n[lang].description` in `Param`, and `x-i18n[lang].example` in `Primitive`, falling back to the default field.
- **Enums `<em>` rendering**: Replace `<em>` markers with `_` (underscore) to match upstream, instead of `-`.
- **`Request-Timeout: 5` header**: Add this header to the rendered curl example when header params are present.
- **`x-admonition` rendering**: Introduce an `Admonitions` renderer and render inline admonitions for the spec, `Param`, and `Primitive`, plus a deprecated-endpoint admonition, reusing the existing local `Admonition.tsx` component.
- Explicitly **out of scope** (no visible effect on milvus.io): `x-base-urls` multi-base-URL tabs, `plane-config`/`siteConfig` Docusaurus plumbing, and the Zilliz-Cloud token change (`db_admin:xxxxxxxxxxxxx`) — milvus.io keeps `root:Milvus`.

## Capabilities

### New Capabilities
- `rest-specs-rendering`: How the REST API spec viewer renders parameters, request/response schemas, multi-option (anyOf/oneOf) tabs, localized text, inline admonitions, and curl examples on milvus.io.

### Modified Capabilities
<!-- None: no existing specs in openspec/specs/ -->

## Impact

- `src/components/mdx/rest-space/RestSpace.tsx` — primary component changes (Param, Primitive, Items, Tab, AnyOf, OneOf, ExampleRequests, RestSpecs).
- `src/components/mdx/rest-space/Admonition.tsx` — reused as-is for inline/deprecated admonitions (no change expected).
- No new dependencies. No API or data-format changes (new behavior is additive and gated on optional `x-i18n` / `x-admonition` fields).
- Out of scope: `BaseURL.tsx`, `utils.ts` `isControlPlane`/`getBaseUrl` signatures (untouched — C-group not synced).
