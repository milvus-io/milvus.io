## 1. Tab & multi-option fixes

- [x] 1.1 Add `if (!content) return null` guard at the top of the `Tab` component
- [x] 1.2 Add `optionValue` prop to `Tab`; use it as the radio `value`/`checked` comparison when provided, falling back to the current label-derived value
- [x] 1.3 Resolve `content["x-i18n"]?.[lang]?.description` in `Tab` and pass the translated description down to `Properties`/`Items`/`Primitive`
- [x] 1.4 Add `getOptionValue(label, index)` helper in `AnyOf`: returns `OPTION N` when `name` is `responses`/`requestBody`, else label-derived value; use it for `defaultValue` and per-tab `optionValue`
- [x] 1.5 Mirror the same `getOptionValue` logic in `OneOf`
- [x] 1.6 Add `x_i18n` prop to `AnyOf`/`OneOf`; render `x_i18n?.[lang]?.description ?? description` for the named-property block

## 2. Localized text (x-i18n)

- [x] 2.1 In `Param`, add `x_i18n` prop and render `x_i18n?.[lang]?.description ?? description`
- [x] 2.2 In `Primitive`, resolve `obj["x-i18n"]?.[lang]?.example ?? obj.example` for the example value
- [x] 2.3 In `Items`, resolve `obj.items["x-i18n"]?.[lang]?.description` when dispatching child `AnyOf`/`OneOf`/`Properties`/`Items`
- [x] 2.4 In `RestSpecs`, pass `x_i18n={param["x-i18n"]}` to header `Param`; pass `x_i18n` of the schema into requestBody/responses `AnyOf`/`OneOf`

## 3. Enum & curl example

- [x] 3.1 Change `Enums` `<em>` replacement from `'-'` to `'_'`
- [x] 3.2 In `ExampleRequests`, append `--header "Request-Timeout: 5"` when `headersExample` is truthy (before the `Content-Type` header), matching upstream string construction
- [x] 3.3 Confirm the non-control-plane token remains `root:Milvus` (no change) and `isControlPlane`/`getBaseUrl` signatures are untouched

## 4. Admonitions

- [x] 4.1 Add a local `Admonitions` component that maps over `x-admonition` items, resolves `x-i18n[lang]` title/content, and renders the local `Admonition` with a default `icon` per `type`
- [x] 4.2 Render `Admonitions` in `Param` (from `admonitions` prop / `param['x-admonition']`)
- [x] 4.3 Render `Admonitions` in `Primitive` (from `obj['x-admonition']`)
- [x] 4.4 Render spec-level `Admonitions` (from `props.specs['x-admonition']`) and a `deprecated` danger admonition in `RestSpecs`
- [x] 4.5 Wire `admonitions` prop through header/path/query `Param` calls in `RestSpecs`

## 5. Verification

- [x] 5.1 Type-check / build the project — `tsc --noEmit -p tsconfig.json` passes with 0 errors (project has `strict:false`/`noImplicitAny` unset; implicit-any editor hints are not build errors)
- [ ] 5.2 Render an existing REST spec page (no `x-i18n`/`x-admonition`) and confirm output is unchanged — verified by static inspection (all new logic falls back to prior behavior); NOT visually confirmed. Note: enum `<em>`→`_` and the `Request-Timeout: 5` header are intended visible syncs, not regressions
- [ ] 5.3 Render a spec with `oneOf`/`anyOf` request body and confirm option N selection — verified by code inspection (`getOptionValue`→`OPTION N`→`selectedRequest` filter); NOT visually confirmed (requires browser)
- [ ] 5.4 Render a spec with `x-admonition` and a deprecated endpoint — verified by code inspection; NOT visually confirmed (requires browser + sample spec)
- [x] 5.5 Confirm `TryItOut` panel and "Try it out" button still work unchanged — verified: no edits to `TryItOut`, the button, or `showTryIt` state
- [x] 5.6 Run `openspec validate "sync-restspace-rendering"` — passes
