# Homepage Redesign — Agent-First Narrative (index2)

**Date:** 2026-04-20
**Author:** ryjiang (brainstormed with Claude)
**Status:** Draft — awaiting user review

## 1. Context

The current milvus.io homepage (`/`, rendered by `src/pages/index.tsx`) still positions Milvus as "The High-Performance Vector Database Built for Scale" with GenAI framing. Two years into the Agent era, the homepage does not reflect:

- Milvus 2.5/2.6 core capabilities: Full-text/BM25, Hybrid Search, Built-in Embeddings, Rerankers, Multi-vector
- Agent-era infrastructure story: MCP-native, Agent Memory use cases
- Milvus 2.6 architectural overhaul: Woodpecker WAL replacing Kafka/Pulsar, Streaming Service, storage/compute disaggregation
- Modern AI ecosystem: agent frameworks (LangGraph / CrewAI / AutoGen / Mastra), MCP, A2A, newer model providers

## 2. Goals & Non-Goals

### Goals

- Reposition Milvus on the homepage as "The Vector Database That Powers AI" — agent/AI application builders are the primary audience, with infra decision-makers served in the lower half of the page.
- Surface the capability pillars relevant to modern AI: Hybrid Search, Built-in Embeddings, Agent Memory, MCP-native.
- Tell the Milvus 2.6 infra story: disaggregated architecture, billion-scale at lower cost (Woodpecker), multi-tenant by design, deploy anywhere.
- Refresh the ecosystem display from an 8-logo flat list to a categorized matrix with Agent Frameworks first.
- Keep SEO anchor: "Vector Database" remains in H1 and meta.

### Non-Goals

- Do NOT replace or modify the existing homepage. Ship this as a new route `/index2` for review and iteration.
- Do NOT modify any file under `src/parts/home/*` or `src/pages/index.tsx`. New components live in a parallel directory.
- No live interactive playground (explicitly cut — static Attu screenshot in Hero instead).
- No Milvus Lite promotion anywhere on the new page (Lite is being de-emphasized per product direction).
- No new backend services for this homepage.

## 3. Delivery Constraint (critical)

**This work ships as a parallel page, NOT a replacement.**

- New route: `/index2` → `src/pages/index2.tsx`
- New component directory: `src/parts/home2/` (parallel to `src/parts/home/`)
- New i18n keys: a new `home2.json` file per locale, loaded under namespace `home2`. Existing `home.json` stays untouched.
- New styles: parallel CSS modules under `src/parts/home2/*/index.module.css`.
- Shared, truly generic components (e.g., `CustomButton`, `Layout`, icons) may be imported. Anything home-specific must be duplicated or newly written.

## 4. Information Architecture

Nine sections, top to bottom:

1. **Hero** — positioning + Attu screenshot
2. **Built for the Agent Era** — four capability pillar cards
3. **Agent-Native Code Walkthrough** — four tabs of real Agent workflows
4. **Architecture Built for the Real Scale of AI** — animated diagram + four architecture pillars + benchmark strip
5. **Ecosystem Matrix** — five categorized groups
6. **Trusted in Production** — numbers strip + customer logo wall
7. **Loved by Developers** — three testimonials (existing content kept)
8. **Community & Meetups** — stats + meetup entry
9. **Final CTA** — three start-path cards

### Mapping from existing sections

| Existing section | New page treatment |
|---|---|
| `HomePageHeaderSection` | Rewritten as new Hero (headline swiper retained, title/subtitle/CTA/visual new) |
| `CodeExampleSection` | Replaced by Agent-Native Code Walkthrough (component shape reused, content new) |
| `DeploySection` | Merged into Architecture section as Pillar 4 "Deploy Anywhere" |
| `AIToolsSection` | Replaced by categorized Ecosystem Matrix |
| `LovedSection` | Kept as-is conceptually; existing testimonials retained |
| `VectorDatabaseSection` | Dissolved; content folded into Capability Pillars + Architecture |
| `DevelopSection` + `MeetupsSection` | Combined into Community & Meetups; tutorial links move to Resources/Footer |
| `ProductionSection` | Kept + numbers strip added above logo wall |
| `tryFreeSection` | Dissolved into Final CTA (one of three cards) |

## 5. Section-by-Section Specification

### 5.1 Section 1 — Hero

**Purpose:** In one screen, tell a visitor "Milvus is the vector database that powers AI applications" and give them a way to start.

**Layout:** Two columns, desktop. Stacked on mobile with Attu image on top.

**Left column (copy + CTA):**

- **Headline badge / news swiper:** Retain existing `Swiper` with all `headlines` from `getHomepageHeadline()`. Visual style unchanged from current Hero.
- **H1:** `The Vector Database That Powers AI`
- **Subtitle:** `Open-source Milvus gives AI applications — from RAG to agents — production-grade hybrid search, built-in embeddings, and scale to 100B+ vectors.`
  - ⚠️ `100B+` must be validated against published benchmarks before launch. If not defensible, substitute "billion-scale".
- **Primary CTA (copy-command card):** A boxed code block with copy-to-clipboard icon, content is **`⚠️ PLACEHOLDER: Agent-ready CLI command TBD`** — decision deferred by user (candidates: `uvx mcp-server-milvus`, `pip install "pymilvus[model]"`, `npx create-milvus-app`, dual-tab Python+MCP). Implementation plan must flag this as a required decision before launch.
- **Secondary CTA:** `Try Zilliz Cloud Free →` — same link + UTM params as current `tryFreeSection`.
- **Social proof strip (under CTAs):** `⭐ GitHub stars · 📥 downloads`. Numbers sourced from `global-stats.json` (existing pattern).

**Right column (visual):**

- **Attu screenshot — Vector Search results view** (option "b" from brainstorming). High-resolution PNG with subtle drop shadow and rounded corner frame, styled to look like a product screenshot (not a mockup).
- Image lives under `public/images/home2/hero-attu-search.png`.
- Must include `alt="Attu — Milvus management UI, vector search results"` for accessibility.
- ⚠️ Source screenshot asset must be provided by design/product before launch.

**Interactions:**

- Swiper keeps existing autoplay / navigation behavior.
- Copy-command card shows a "Copied" tooltip for ~1.5s on click.
- No other motion in Hero (keep LCP fast; Attu image is the visual anchor).

### 5.2 Section 2 — Built for the Agent Era

**Purpose:** Establish the four capability pillars that make Milvus relevant to modern AI.

**Layout:** Section header + 2×2 grid of cards (desktop) / vertical stack (mobile).

**Header:**

- Title: `Built for the Agent Era`
- Sub: `Four capabilities that make Milvus drop-in for modern AI applications.`

**Card shape (applied to all four):**

- Top: mini-icon or illustration (SVG)
- Title (H3)
- 2-line body copy
- Collapsed code block (~4–6 lines, monospace, themed to match existing `CodeExampleSection`)
- `Learn more →` text link

**Card 1 — Hybrid Search, Built-in**

- Illustration: three lanes (dense / sparse / rerank) converging into one result line.
- Body: `Combine semantic (dense), keyword (BM25 sparse), and rerankers in one query. No external Elasticsearch. Better RAG answers out of the box.`
- Code (⚠️ needs verification against current `pymilvus` API):
  ```python
  client.hybrid_search(
      "docs",
      [AnnSearchRequest(dense_vec, ...),
       AnnSearchRequest(sparse_vec, ...)],
      rerank=RRFRanker(),
  )
  ```
- Link: `/docs/multi-vector-search.md` (or current Hybrid Search doc path).

**Card 2 — Embeddings Without the Pipeline**

- Illustration: `text → vector` transformation with OpenAI / BGE / Jina logos floating.
- Body: `Call OpenAI, Cohere, BGE, Jina, or local models directly inside Milvus. No separate embedding service to run and scale.`
- Code (⚠️ needs verification against current `pymilvus` API for built-in embedding functions):
  ```python
  schema.add_function(Function(
      name="embed",
      input_field_names=["text"],
      function_type=FunctionType.TEXT_EMBEDDING,
      params={"provider": "openai",
              "model": "text-embedding-3-small"},
  ))
  ```
- Link: embedding functions doc (path TBD).

**Card 3 — Memory That Scales With Your Agent**

- Illustration: an agent icon connected to a partitioned memory store.
- Body: `Partition per user, per session, per tool. Session memory today, billions of long-term memories tomorrow — same API.`
- Code (⚠️ needs verification):
  ```python
  client.insert("agent_memory",
      {"user_id": "u_123", "text": "...", "ts": now()})

  client.search("agent_memory", queries=[...],
      filter='user_id == "u_123"')
  ```
- Link: Agent Memory guide (path TBD — may need a new guide page).

**Card 4 — MCP-Native**

- Illustration: MCP plug icon + Claude / Cursor / LangGraph small logos.
- Body: `Expose Milvus as an MCP server with one command. LangGraph, CrewAI, Claude Desktop, Cursor — all speak MCP.`
- Code (⚠️ needs verification that `uvx mcp-server-milvus` is the actual published entrypoint):
  ```bash
  uvx mcp-server-milvus --uri http://localhost:19530
  ```
- Link: MCP server repo URL (to be provided).

### 5.3 Section 3 — Agent-Native Code Walkthrough

**Purpose:** Show the real flow an Agent developer goes through with Milvus.

**Layout:** Reuse the visual structure of the existing `CodeExampleSection` (top tabs, left code, right commentary). Content replaced.

**Header:**

- Title: `Start building your AI app in minutes`
- Sub: `Four snippets that cover the real Agent workflow.`

**Tabs:**

1. **Add Memory** — creating a collection and writing a memory entry.
2. **Semantic Recall** — retrieving relevant memories with auto-embed + filter.
3. **Multi-tenant Isolation** — Partition Key for per-user isolation.
4. **Serve as MCP Server** — running Milvus as an MCP server for any agent framework.

**All code snippets** use `uri="http://localhost:19530"` as the default connection string. Do **not** use `uri="milvus.db"` (Milvus Lite file mode) — Lite is de-emphasized per product direction.

**Snippets** (all `⚠️ needs verification`):

Tab 1 — Add Memory:
```python
from pymilvus import MilvusClient

client = MilvusClient(uri="http://localhost:19530")

client.create_collection(
    "agent_memory",
    dimension=1536,
    auto_id=True,
    vector_field_name="text_vec",
    enable_dynamic_field=True,
)

client.insert("agent_memory", [
    {"user_id": "u_123", "text": "User prefers dark mode", "ts": 1734567890},
    {"user_id": "u_123", "text": "User is learning Rust",  "ts": 1734567891},
])
```
Right-panel note: `Start a local Milvus with docker-compose and you're running in under a minute.`

Tab 2 — Semantic Recall:
```python
results = client.search(
    "agent_memory",
    data=["What are the user's UI preferences?"],
    limit=5,
    filter='user_id == "u_123"',
    output_fields=["text", "ts"],
)

for hit in results[0]:
    print(hit["entity"]["text"], hit["distance"])
```
Right-panel note: `Hybrid search, filters, and rerank are one flag away when you need better recall.`

Tab 3 — Multi-tenant Isolation:
```python
client.create_collection(
    "agent_memory",
    dimension=1536,
    partition_key_field="user_id",
    num_partitions=64,
)
```
Right-panel note: `Partition Key + Resource Groups give you per-tenant isolation without running a cluster per customer.`

Tab 4 — Serve as MCP Server:
```bash
uvx mcp-server-milvus --uri http://localhost:19530
```
Right-panel note: `Any MCP-aware agent can now read and write your Milvus data as tools.`

### 5.4 Section 4 — Architecture Built for the Real Scale of AI

**Purpose:** Convince the infra decision-maker that Milvus 2.6 is production-grade and cost-efficient.

**Header:**

- Title: `Built for the Real Scale of AI — Without the Real Cost`
- Sub: `Milvus 2.6 rebuilt the streaming and storage layers from the ground up to run billion-scale vector workloads on cheap object storage.`

**Layout:**

```
[ Header ]
[ Architecture Diagram — animated SVG ]
[ 4 Pillar Cards in a row (desktop) / 2x2 (tablet) / stack (mobile) ]
[ Benchmark strip ]
```

**Architecture Diagram:**

Four stacked layers, Milvus 2.6 accurate:

1. **Access Layer** — `Proxy Service` (stateless gRPC/HTTP gateway).
2. **Coordinator** (single logical component in 2.6) — containing `RootCoord`, `DataCoord`, `QueryCoord`, `Streaming Coordinator`.
3. **Worker Layer** — three node types: `QueryNode` (vector + scalar search), `DataNode` (flushes binlogs), `StreamingNode` (new in 2.6 — WAL + growing data querying via Woodpecker).
4. **Storage Layer** — `Object Storage (S3/GCS/MinIO/Azure/OSS)`, `etcd` (metadata), `Woodpecker` (WAL, replaces Kafka/Pulsar in 2.6).

**Animation (Framer Motion or Lottie):**

- On view-in-viewport, a data write path highlights: `SDK → Proxy → StreamingNode → Woodpecker → Object Storage`.
- Then a query path highlights: `SDK → Proxy → QueryNode + StreamingNode → result`.
- Keep subtle; respect `prefers-reduced-motion`.

**Four Architecture Pillars:**

| # | Title | Body |
|---|---|---|
| 1 | Storage–Compute Disaggregation | Query, data, and streaming nodes scale independently on top of cheap object storage. |
| 2 | Billion-Scale at a Fraction of the Cost | Milvus 2.6's new Woodpecker WAL replaces Kafka/Pulsar — zero-disk, cloud-native, dramatically cheaper at scale. |
| 3 | Multi-Tenant by Design | Partition Key + Resource Groups — one cluster, thousands of tenants, full isolation. |
| 4 | Deploy Anywhere, Same API | Standalone on a single box, Distributed on Kubernetes, or Zilliz Cloud — same `MilvusClient` code. |

Note: Pillar 4 intentionally omits Milvus Lite.

**Benchmark Strip (horizontal row of 4 stats):**

`⚡ Sub-XX ms p99  ·  📦 Billion-scale tested  ·  💰 ~XX% lower infra cost vs 2.5  ·  🛰 AWS · GCP · Azure · BYOC`

All numeric values are `⚠️ needs verification` — real numbers must come from engineering/PM before launch.

### 5.5 Section 5 — Ecosystem Matrix

**Purpose:** Replace the flat 8-logo `AIToolsSection` with a categorized view that leads with Agent frameworks.

**Header:**

- Title: `Plugs Into Your Entire AI Stack`
- Sub: `Drop Milvus into the agent framework, model API, RAG tool, or protocol you already use.`

**Layout:**

- Desktop: five category blocks stacked vertically, each block has a heading + logo row.
- Mobile: accordion — each category collapses, user taps to expand.

**Initial categorization (using only the 8 existing logos from current `AIToolsSection`):**

| Category | Logos | Note |
|---|---|---|
| Agent Frameworks | MemGPT | ⚠️ gap — add LangGraph / CrewAI / AutoGen / Mastra / Pydantic AI before public launch |
| Model APIs | OpenAI, Hugging Face | Could add Anthropic / Gemini / Bedrock if integrations are documented |
| RAG Stacks | LangChain, LlamaIndex, Haystack, DSPy | Strongest category |
| Protocols | (empty) | ⚠️ gap — add MCP, A2A integrations before public launch |
| Eval & Observability | Ragas | Could add DeepEval / LangSmith / Arize when integrations land |

Existing logo image assets (`/images/home/*.png`) can be referenced directly from `src/parts/home2/*`.

No "See all →" link — removed per user decision. Each logo links to its existing integration doc (same `MILVUS_INTEGRATION_*_LINK` constants from `@/consts/links`).

**Action item for launch readiness:** Agent Frameworks and Protocols categories are thin. The implementation plan should surface this as a content-collection task so the page does not ship with a near-empty category.

### 5.6 Section 6 — Trusted in Production

**Purpose:** Anchor trust with hard numbers + enterprise logos.

**Header:**

- Title: `Trusted in production by the teams building AI`

**Layout:**

```
[ Numbers strip — 4 metrics, animated count-up on scroll-into-view ]
[ Customer logo wall — reuse existing visual from ProductionSection ]
```

**Numbers strip (4 metrics):**

1. `25M+` downloads — read from `global-stats.json`.
2. `35K+` GitHub stars — read from `global-stats.json`.
3. `XX+` Fortune 500 / enterprise customers — ⚠️ number to be provided.
4. `XX billion` vectors served (or similar scale metric) — ⚠️ number to be provided.

**Logo wall:**

Duplicate the component shape of current `ProductionSection` into `src/parts/home2/productionSection2/`. Asset list stays the same unless product wants to refresh.

### 5.7 Section 7 — Loved by Developers

**Purpose:** Social proof from individual developers.

**Layout:** Same as current `LovedSection` — three testimonial cards.

**Content decision:** Retain all three existing testimonials (Nandula Asel, Bhargav Mankad, Igor Gorbenko) verbatim. Refreshing a testimonial to be Agent-focused was discussed but explicitly deferred by user ("随便搞").

Duplicate the component into `src/parts/home2/lovedSection2/` to keep the parallel-page constraint.

### 5.8 Section 8 — Community & Meetups

**Purpose:** Surface the community — the open-source moat.

**Layout (two-column):**

Left column — Community stats card:
- ⭐ `35K+` GitHub stars
- 👥 `XXX+` contributors ⚠️ needs number
- 📥 `25M+` downloads
- 💬 Discord / Forum links

Right column — Meetups card:
- Reuse existing `MeetupsSection` component content (title + description + CTA).
- Link to Unstructured Data Meetups page.

Mobile: stacked, stats first.

### 5.9 Section 9 — Final CTA

**Purpose:** Close the page with three clear starting paths.

**Header:**

- Title: `Start building in minutes`

**Layout (three equal cards):**

| Card | Icon | Content | Button |
|---|---|---|---|
| Python | 🐍 | `pip install pymilvus` (or the same agent-ready CLI placeholder as Hero — must match) | `Copy →` |
| Cloud | ☁️ | `Try Zilliz Cloud Free` | `Sign up →` (Cloud signup with existing UTM params) |
| Docs | 📖 | `Read the docs` | `Browse →` |

The Python card and Hero primary CTA must display the **same command string** — whatever the final decision on the placeholder resolves to.

## 6. File Layout

```
src/
├── pages/
│   ├── index.tsx             ← UNCHANGED
│   └── index2.tsx            ← NEW (entry point)
├── parts/
│   ├── home/                 ← UNCHANGED
│   └── home2/                ← NEW
│       ├── heroSection2/
│       ├── capabilityPillars/
│       ├── codeWalkthrough/
│       ├── architectureSection/
│       ├── ecosystemMatrix/
│       ├── productionSection2/
│       ├── lovedSection2/
│       ├── communityMeetups/
│       └── finalCTA/
├── i18n/
│   └── <locale>/
│       ├── home.json         ← UNCHANGED
│       └── home2.json        ← NEW (one per locale; English first, others can lag)
└── styles/
    └── home2.module.css      ← NEW (or colocated CSS modules, per existing pattern)

public/
└── images/
    └── home2/                ← NEW (Attu screenshot, architecture diagram SVG, etc.)
```

**Shared / allowed-to-import:**
- `@/components/layout/commonLayout` (Layout)
- `@/components/customButton` (CustomButton)
- `@/components/icons` (icons)
- `@/consts/links` (link constants)
- `@/hooks/use-global-locale`
- `@/types/localization`
- `@/utils/blogs` (for headlines)

**Forbidden to import or modify:**
- Anything under `src/parts/home/**`
- `src/pages/index.tsx`
- `src/i18n/*/home.json`

## 7. Data & Content

- **Hero headlines:** use existing `getHomepageHeadline()`.
- **Stats (downloads, stars, contributors):** read from `global-stats.json` or add new keys as needed.
- **Customer logos:** asset paths from current `ProductionSection`; may reference `public/images/home/**` (read-only use of assets is fine; we're not modifying them).
- **Ecosystem logos:** reference `public/images/home/*.png` for existing 8 tools.
- **Attu screenshot:** new asset, placed at `public/images/home2/hero-attu-search.png`.
- **Architecture diagram:** new SVG asset at `public/images/home2/architecture-2-6.svg`, with Framer Motion animation layered in React.

## 8. Internationalization

- New namespace `home2` (file: `home2.json`) added per locale.
- English content is authored in this spec. Launch gate requires English only; other locales can be translated post-launch with standard flow.
- All hardcoded English in components must go through `t()` with the `home2` namespace.

## 9. Accessibility & Performance

- Attu image + architecture diagram must have descriptive `alt` text.
- Animations (architecture diagram, numbers count-up) must respect `prefers-reduced-motion`.
- Hero LCP element = Attu image; use `next/image` with `priority` and the proper `width`/`height`.
- No client-side data fetching in Hero; `getStaticProps` for headlines (same as current index).
- No live playground → no extra runtime dependency.

## 10. SEO

- H1 retains `Vector Database`.
- Meta title and description live in a new `home2` `HomeMeta` component (or a shared meta component taking namespace as prop).
- `canonicalUrl` for `/index2` set to `null` for the duration of preview (matches the recent null-vs-undefined fix in commit `ec6c2619`). When the page replaces `/`, canonical switches to the root URL.
- `index2` route should be marked `noindex` via `<meta name="robots" content="noindex, nofollow">` until product decides to promote it.

## 11. Open Items Requiring Decision Before Launch

These are the items explicitly deferred during brainstorming:

1. **Hero + Final CTA primary command** — the "Agent-ready CLI" placeholder. Final decision among: `uvx mcp-server-milvus`, `pip install "pymilvus[model]"`, `npx create-milvus-app`, or a dual-tab Python/MCP toggle.
2. **Attu screenshot asset** — final PNG provided by design/product.
3. **All code snippets (Sections 2, 3, 5, Final CTA)** — verified against the currently published `pymilvus` and MCP server APIs. Anything that does not run as published gets rewritten.
4. **Architecture diagram SVG** — designed and animated.
5. **Numeric claims** marked `⚠️ needs verification`:
   - Hero subtitle "100B+ vectors"
   - Architecture benchmark strip (p99, billion-scale, % cost reduction)
   - Trusted in Production (Fortune 500 count, scale metric)
   - Community & Meetups (contributor count)
6. **Ecosystem Matrix content gaps** — Agent Frameworks and Protocols categories need at least 3 logos each (with verified integrations) before public launch.
7. **Testimonial refresh** — explicitly deferred (keep existing three).
8. **MCP server link** — official repo URL for Card 4 "Learn more" and Tab 4 reference.
9. **Doc-link targets** — final URLs for Card 1 (Hybrid Search), Card 2 (Built-in Embedding Functions), Card 3 (Agent Memory guide — may require creating a new guide page).

## 12. Launch Plan

- Ship `/index2` as a preview route with `noindex`.
- Internal review → iterate on copy, visuals, and the open items above.
- Once validated, a separate follow-up (out of scope for this spec) will replace `index.tsx` with the `index2` implementation and retire `/index2`.
