## ADDED Requirements

### Requirement: Multi-option schema tab synchronization

When a `requestBody` or `responses` schema uses `anyOf`/`oneOf`, the schema option tabs and the corresponding example tabs SHALL stay synchronized. Each option tab SHALL be identified by a stable value `OPTION N` (1-based index), so selecting an option updates the displayed request/response example accordingly.

#### Scenario: Selecting a non-default request schema option
- **WHEN** a request body schema has multiple `oneOf` options and the user selects the second option tab
- **THEN** the rendered curl request example switches to the example associated with `OPTION 2`

#### Scenario: Named property anyOf retains label-based value
- **WHEN** an `anyOf`/`oneOf` appears on a named property (not `requestBody`/`responses`)
- **THEN** the option value is derived from the option label (uppercased), preserving existing behavior

### Requirement: Tab content guard

A schema/example tab SHALL render nothing instead of failing when its content is undefined.

#### Scenario: Undefined tab content
- **WHEN** a `Tab` is rendered with `content` undefined
- **THEN** the component returns `null` and does not throw

### Requirement: Localized text via x-i18n

Descriptions and example values SHALL be rendered from `x-i18n[lang]` when present, falling back to the default field otherwise. This applies to `Param`, `Primitive` (description and example), `AnyOf`/`OneOf`, `Items` child dispatch, and `Tab`.

#### Scenario: Localized description present
- **WHEN** a parameter or schema node has `x-i18n[lang].description` for the active language
- **THEN** the localized description is rendered instead of the default `description`

#### Scenario: Localized example present
- **WHEN** a primitive schema has `x-i18n[lang].example` for the active language
- **THEN** the localized example value is rendered

#### Scenario: No localization available
- **WHEN** `x-i18n` for the active language is absent
- **THEN** the default `description`/`example` is rendered unchanged

### Requirement: Enum em-marker rendering

Enum values SHALL render `<em>` markers as underscore (`_`), consistent with upstream.

#### Scenario: Enum value containing em markup
- **WHEN** an enum value contains `<em>`/`</em>`
- **THEN** those tags are replaced with `_` in the rendered option text

### Requirement: Curl example request timeout header

When the rendered curl example includes header parameters, it SHALL also include a `Request-Timeout: 5` header.

#### Scenario: Endpoint with header parameters
- **WHEN** an endpoint defines one or more `header` parameters
- **THEN** the rendered curl example contains `--header "Request-Timeout: 5"` alongside the other headers

#### Scenario: Endpoint without header parameters
- **WHEN** an endpoint defines no `header` parameters
- **THEN** the curl example does not include the `Request-Timeout` header

### Requirement: Inline admonitions rendering

The spec viewer SHALL render `x-admonition` entries as admonition blocks using the local `Admonition` component, at the spec level and within `Param` and `Primitive`. A deprecated endpoint SHALL render a danger admonition.

#### Scenario: Spec-level admonitions
- **WHEN** the spec has `x-admonition` entries
- **THEN** each entry renders as an admonition with its (optionally `x-i18n`-localized) title and content

#### Scenario: Deprecated endpoint
- **WHEN** the endpoint spec is marked `deprecated`
- **THEN** a danger-type deprecated admonition is rendered

#### Scenario: No admonitions
- **WHEN** no `x-admonition` is present and the endpoint is not deprecated
- **THEN** no admonition block is rendered

### Requirement: Preserve milvus.io-specific behavior

The sync SHALL NOT alter milvus.io-specific behavior: the default cluster token remains `root:Milvus`, and the local `Admonition`/`CodeBlock`/`BaseURL`/`TryItOut` components and the "Try it out" panel are retained. `x-base-urls` multi-base-URL UI and `plane-config`/`siteConfig` plumbing are NOT introduced.

#### Scenario: Non-control-plane curl token
- **WHEN** a non-control-plane endpoint curl example is rendered on milvus.io
- **THEN** the token line is `export TOKEN="root:Milvus"` (not the Zilliz-Cloud token)

#### Scenario: Try it out panel preserved
- **WHEN** the user clicks "Try it out"
- **THEN** the existing `TryItOut` panel renders as before, unaffected by this change
