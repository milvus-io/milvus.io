# Homepage Redesign (Agent-First /index2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **User preference — no auto-commits.** The commit steps in this plan are explicit checkpoints. If you are Claude executing this plan, **pause before each `git commit` step and ask the user for approval**. Never `git commit` without an explicit "commit" instruction from the user in the current session. (See memory: `feedback_no_auto_commit.md`.)

**Goal:** Ship a parallel homepage at `/index2` that repositions Milvus as "The Vector Database That Powers AI" without touching the existing `/` homepage or any file under `src/parts/home/**`.

**Architecture:** Next.js Pages Router. New route `src/pages/index2.tsx` composes a new set of section components under `src/parts/home2/**`. All copy is in a new i18n namespace `home2` (file: `src/i18n/<locale>/home2.json`). No backend changes. No shared state with the existing homepage.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind + CSS Modules (existing project conventions), `react-i18next` for localization, `swiper` for the Hero headline slider (already installed), Playwright for smoke tests.

**Source spec:** `docs/superpowers/specs/2026-04-20-homepage-redesign-agent-first-design.md` — all copy, capability descriptions, architecture diagram, open items, and numeric claims live there. This plan references the spec by section number; do not duplicate content.

**Hard constraints (read before every task):**
- Do NOT modify any file under `src/parts/home/**`.
- Do NOT modify `src/pages/index.tsx`.
- Do NOT modify any `src/i18n/<locale>/home.json`.
- Do NOT promote Milvus Lite (code uses `uri="http://localhost:19530"`).
- Any number flagged `⚠️ needs verification` in the spec must be rendered literally as placeholder text (e.g., `"Sub-XX ms p99"`) — do not invent numbers.

---

## File Structure (created by this plan)

```
src/
├── pages/
│   └── index2.tsx                                 NEW — page composition
├── parts/
│   └── home2/                                     NEW — all home2 components
│       ├── meta/HomeMeta2.tsx                     Meta + noindex
│       ├── heroSection2/
│       │   ├── index.tsx
│       │   └── index.module.css
│       ├── capabilityPillars/
│       │   ├── index.tsx
│       │   ├── index.module.css
│       │   └── const.ts                           Pillar definitions + code snippets
│       ├── codeWalkthrough/
│       │   ├── index.tsx
│       │   ├── index.module.css
│       │   └── const.ts                           Tab code snippets (constants)
│       ├── architectureSection/
│       │   ├── index.tsx
│       │   ├── index.module.css
│       │   └── diagram.tsx                        Inline SVG + Framer-style motion
│       ├── ecosystemMatrix/
│       │   ├── index.tsx
│       │   ├── index.module.css
│       │   └── const.ts                           Category + logo list
│       ├── productionSection2/
│       │   ├── index.tsx
│       │   └── index.module.css
│       ├── lovedSection2/
│       │   ├── index.tsx
│       │   └── index.module.css
│       ├── communityMeetups/
│       │   ├── index.tsx
│       │   └── index.module.css
│       └── finalCTA/
│           ├── index.tsx
│           └── index.module.css
├── i18n/
│   ├── index.ts                                   MODIFIED — add 'home2' to ns array
│   ├── en/
│   │   ├── index.ts                               MODIFIED — import + re-export home2
│   │   └── home2.json                             NEW — English copy
│   └── react-i18next.d.ts                         MODIFIED if needed for types
├── styles/
│   └── home2.module.css                           NEW — optional page-level wrapper styles

public/
└── images/
    └── home2/                                     NEW
        ├── hero-attu-search.png                   PLACEHOLDER until real asset provided
        └── architecture-2-6.svg                   PLACEHOLDER until real asset provided

tests/
└── index2.smoke.test.js                           NEW — Playwright smoke test
```

**Allowed imports from outside `home2`:**
- `@/components/layout/commonLayout`
- `@/components/customButton`
- `@/components/customTabs` (used by `CodeWalkthrough`)
- `@/components/icons`
- `@/consts/links` (existing `MILVUS_INTEGRATION_*_LINK`, `CLOUD_SIGNUP_LINK`, `GET_START_LINK`, `LEARN_MORE_LINK`)
- `@/hooks/enhanceCodeBlock` (for `useCopyCode` if needed)
- `@/hooks/use-global-locale`
- `@/types/localization`
- `@/utils/blogs` (`getHomepageHeadline`)
- `@/consts` (`ABSOLUTE_BASE_URL`)
- `@/styles/responsive.module.css`

**Read-only reference to existing assets** (these are OK to use; we are not modifying them):
- `public/images/home/*.png` — reuse ecosystem logo images and production customer logos.
- Existing global stats data source (component-level — see Task 1 for detection).

---

## Task 1: Scaffold `/index2` route, `home2` i18n namespace, `HomeMeta2`

**Purpose:** Bring up an empty, routable, localized, `noindex` shell. Every subsequent task will plug sections into this shell.

**Files:**
- Create: `src/i18n/en/home2.json`
- Modify: `src/i18n/en/index.ts`
- Modify: `src/i18n/index.ts`
- Create: `src/parts/home2/meta/HomeMeta2.tsx`
- Create: `src/pages/index2.tsx`
- Create: `src/styles/home2.module.css`
- Create: `tests/index2.smoke.test.js`

### - [ ] Step 1: Write failing smoke test for `/index2` shell

Create `tests/index2.smoke.test.js`:

```javascript
const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.INDEX2_BASE_URL || 'http://localhost:8000';

test.describe('/index2 shell', () => {
  test('page loads with correct title and noindex meta', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page).toHaveTitle(/Milvus/);
    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
```

### - [ ] Step 2: Run the test and confirm it fails

Open a terminal, start the dev server:
```bash
pnpm dev:fe
```
Wait for "compiled client and server" message, then in another terminal:
```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: FAIL — the route `/index2` does not exist yet, so the `goto` call returns a 404 page whose title does not match `/Milvus/`.

### - [ ] Step 3: Create the English `home2.json` with minimal keys

Create `src/i18n/en/home2.json` with just the meta keys — sections will be added in later tasks:

```json
{
  "meta": {
    "title": "Milvus — The Vector Database That Powers AI",
    "description": "Open-source Milvus gives AI applications — from RAG to agents — production-grade hybrid search, built-in embeddings, and scale to 100B+ vectors."
  }
}
```

### - [ ] Step 4: Register the `home2` namespace in i18n

Modify `src/i18n/en/index.ts` — add import + export for `home2`:

```typescript
import demo from './demo.json';
import docs from './docs.json';
import header from './header.json';
import home from './home.json';
import home2 from './home2.json';
import intro from './intro.json';
import common from './milvus.json';
import sizingTool from './sizingTool.json';
import useCase from './useCase.json';
import community from './community.json';
import notFound from './404.json';
import blog from './blog.json';
import contact from './contact.json';
import faq from './faq.json';
import llm from './llm.json';
import learnMilvus from './learnMilvus.json';

export {
  demo,
  docs,
  header,
  home,
  home2,
  intro,
  common,
  sizingTool,
  useCase,
  community,
  notFound,
  blog,
  contact,
  faq,
  llm,
  learnMilvus,
};
```

Modify `src/i18n/index.ts` — add `'home2'` to the `ns` array (insert after `'home'`):

```typescript
  ns: [
    'common',
    'useCase',
    'intro',
    'header',
    'sizingTool',
    'home',
    'home2',
    'docs',
    'demo',
    'community',
    'notFound',
    'blog',
    'contact',
    'faq',
    'llm',
    'learnMilvus',
  ],
```

Note: other locales (`cn`, `ja`, etc.) do not need their own `home2.json` for this MVP — i18next will fall back to English via the existing `fallbackLng: defaultLanguage` setting. Non-English users see English copy until translations are added in a follow-up.

### - [ ] Step 5: Create `HomeMeta2`

Create `src/parts/home2/meta/HomeMeta2.tsx`:

```typescript
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/types/localization';

type Props = {
  locale: LanguageEnum;
};

export const HomeMeta2 = (props: Props) => {
  const { locale } = props;
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
};
```

### - [ ] Step 6: Create `src/styles/home2.module.css`

```css
.homepageContainer {
  overflow: hidden;
}
```

Keep this file minimal. Per-section styles live inside each section folder.

### - [ ] Step 7: Create `src/pages/index2.tsx` — empty shell

```typescript
import Layout from '@/components/layout/commonLayout';
import { HomeMeta2 } from '@/parts/home2/meta/HomeMeta2';
import classes from '@/styles/home2.module.css';
import pageClasses from '@/styles/responsive.module.css';
import { LanguageEnum } from '@/types/localization';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export default function Homepage2() {
  const { locale } = useGlobalLocale();

  return (
    <Layout headerClassName={pageClasses.homeContainer}>
      <main className={classes.homepageContainer}>
        <HomeMeta2 locale={locale || LanguageEnum.ENGLISH} />
        {/* Sections will be added in later tasks */}
      </main>
    </Layout>
  );
}
```

### - [ ] Step 8: Run the smoke test and confirm it passes

With the dev server still running:
```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: PASS — the page loads, title matches `/Milvus/`, robots meta says `noindex, nofollow`.

### - [ ] Step 9: Commit (ask user for approval first)

Pause and ask the user:
> "Task 1 complete — `/index2` shell is routable and noindex-safe. Smoke test passes. Commit now?"

If approved, run:
```bash
git add src/i18n/index.ts src/i18n/en/index.ts src/i18n/en/home2.json \
        src/parts/home2/meta/HomeMeta2.tsx src/pages/index2.tsx \
        src/styles/home2.module.css tests/index2.smoke.test.js
git commit -m "feat(home2): scaffold /index2 route and home2 i18n namespace"
```

---

## Task 2: Hero Section

**Purpose:** Implement Section 1 of the spec. Two-column hero: copy + CTA on the left, Attu screenshot on the right. Headline swiper retained.

**Spec reference:** `2026-04-20-homepage-redesign-agent-first-design.md` §5.1.

**Files:**
- Create: `src/parts/home2/heroSection2/index.tsx`
- Create: `src/parts/home2/heroSection2/index.module.css`
- Modify: `src/i18n/en/home2.json` — add `hero` keys
- Modify: `src/pages/index2.tsx` — wire in HeroSection2 and `getStaticProps`
- Create placeholder: `public/images/home2/hero-attu-search.png`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend the smoke test

Add a Hero-specific test block after the existing one in `tests/index2.smoke.test.js`:

```javascript
test.describe('/index2 hero', () => {
  test('renders headline, subtitle, and primary CTA placeholder', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(
      page.getByRole('heading', { level: 1, name: /Vector Database That Powers AI/i })
    ).toBeVisible();
    await expect(page.getByText(/hybrid search, built-in embeddings/i)).toBeVisible();
    await expect(page.getByText(/⚠️ PLACEHOLDER/i)).toBeVisible();
    await expect(page.locator('img[alt*="Attu"]').first()).toBeVisible();
  });
});
```

### - [ ] Step 2: Run the test and confirm the Hero block fails

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: The `/index2 hero` test FAILS (heading not found). The earlier shell test still passes.

### - [ ] Step 3: Add Hero keys to `src/i18n/en/home2.json`

Merge into the existing JSON:

```json
{
  "meta": {
    "title": "Milvus — The Vector Database That Powers AI",
    "description": "Open-source Milvus gives AI applications — from RAG to agents — production-grade hybrid search, built-in embeddings, and scale to 100B+ vectors."
  },
  "hero": {
    "title": "The <0>Vector Database</0><1 /> That Powers AI",
    "subtitle": "Open-source Milvus gives AI applications — from RAG to agents — production-grade hybrid search, built-in embeddings, and scale to 100B+ vectors.",
    "ctaPlaceholder": "⚠️ PLACEHOLDER: Agent-ready CLI command TBD",
    "ctaSecondary": "Try Zilliz Cloud Free",
    "attuAlt": "Attu — Milvus management UI, vector search results",
    "starsLabel": "GitHub stars",
    "downloadsLabel": "downloads"
  }
}
```

The `<0>` / `<1 />` placeholders mirror the existing `Trans` pattern in `src/parts/home/headerSection/index.tsx` — `<0>` wraps the blue "Vector Database" span, `<1 />` is the line break.

### - [ ] Step 4: Create the placeholder Attu image

Until design provides the real screenshot, use a placeholder. Create a tiny SVG saved as a PNG-named file that Next.js will still serve:

```bash
mkdir -p public/images/home2
cat > public/images/home2/hero-attu-search.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600">
  <rect width="960" height="600" fill="#f1f5f9"/>
  <rect x="24" y="24" width="912" height="552" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" rx="12"/>
  <text x="480" y="300" text-anchor="middle" dominant-baseline="middle"
        font-family="monospace" font-size="22" fill="#64748b">
    Attu screenshot placeholder — replace with real PNG
  </text>
</svg>
EOF
```

Reference this as `/images/home2/hero-attu-search.svg` from the component (the `.png` filename in the spec was aspirational — use the SVG placeholder until the real PNG ships).

### - [ ] Step 5: Create `src/parts/home2/heroSection2/index.module.css`

```css
.heroSection {
  padding: 98px 0 100px;
  background: #ffffff;
}

@media (max-width: 768px) {
  .heroSection {
    padding: 48px 0 60px;
  }
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.leftColumn {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.swiperWrap {
  max-width: 520px;
}

.title {
  font-size: 64px;
  line-height: 1.1;
  font-weight: 700;
  color: #0f172a;
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .title {
    font-size: 48px;
  }
}

@media (max-width: 640px) {
  .title {
    font-size: 36px;
  }
}

.titleAccent {
  color: #1d4ed8;
}

.subtitle {
  font-size: 18px;
  line-height: 1.5;
  color: #334155;
  max-width: 560px;
}

.ctaRow {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.copyCommand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #0f172a;
  color: #f8fafc;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #0f172a;
}

.copyCommand:hover {
  opacity: 0.9;
}

.copyCommandPlaceholder {
  color: #fbbf24;
}

.socialProof {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #475569;
}

.rightColumn {
  display: flex;
  justify-content: center;
}

.attuImage {
  width: 100%;
  max-width: 640px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  border: 1px solid #e2e8f0;
}
```

### - [ ] Step 6: Create `src/parts/home2/heroSection2/index.tsx`

```typescript
import { useTranslation, Trans } from 'react-i18next';
import { useRef, useMemo, useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import CustomButton from '@/components/customButton';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import { LanguageEnum } from '@/types/localization';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

type Props = {
  headlines: { label: string; link: string; tag: string }[];
  locale: LanguageEnum;
  stars?: string;
  downloads?: string;
};

export default function HeroSection2(props: Props) {
  const { headlines, locale, stars = '35K+', downloads = '25M+' } = props;
  const { t } = useTranslation('home2', { lng: locale });
  const [copied, setCopied] = useState(false);

  const showSwiper = useMemo(() => headlines.length > 1, [headlines]);
  const nextBtn = useRef<HTMLButtonElement>(null);
  const prevBtn = useRef<HTMLButtonElement>(null);

  const placeholderCmd = t('hero.ctaPlaceholder');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(placeholderCmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unsupported — no-op */
    }
  };

  return (
    <section className={classes.heroSection}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.grid}>
          <div className={classes.leftColumn}>
            {headlines.length > 0 && (
              <div className={classes.swiperWrap}>
                <Swiper
                  modules={showSwiper ? [Navigation, Autoplay, Pagination] : []}
                  navigation={{ prevEl: prevBtn.current, nextEl: nextBtn.current }}
                  autoplay={showSwiper ? { delay: 8000, disableOnInteraction: false } : false}
                  loop={showSwiper}
                  slidesPerView={1}
                >
                  {headlines.map(item => (
                    <SwiperSlide key={item.label}>
                      <Link href={item.link}>
                        {item.tag} · {item.label}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <h1 className={classes.title}>
              <Trans
                t={t}
                i18nKey="hero.title"
                components={[
                  <span key="accent" className={classes.titleAccent} />,
                  <br key="br" />,
                ]}
              />
            </h1>

            <p className={classes.subtitle}>{t('hero.subtitle')}</p>

            <div className={classes.ctaRow}>
              <button
                type="button"
                onClick={handleCopy}
                className={classes.copyCommand}
                aria-label="Copy install command"
              >
                <span className={classes.copyCommandPlaceholder}>
                  {copied ? 'Copied' : placeholderCmd}
                </span>
              </button>
              <CustomButton
                href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_hero&utm_content=home2`}
                size="large"
                variant="outlined"
              >
                {t('hero.ctaSecondary')} →
              </CustomButton>
            </div>

            <div className={classes.socialProof}>
              <span>⭐ {stars} {t('hero.starsLabel')}</span>
              <span>📥 {downloads} {t('hero.downloadsLabel')}</span>
            </div>
          </div>

          <div className={classes.rightColumn}>
            <img
              src="/images/home2/hero-attu-search.svg"
              alt={t('hero.attuAlt')}
              className={classes.attuImage}
              width={640}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire the Hero into `src/pages/index2.tsx`

Replace the page with the version below (adds `getStaticProps` for `headlines`, imports `HeroSection2`):

```typescript
import Layout from '@/components/layout/commonLayout';
import { HomeMeta2 } from '@/parts/home2/meta/HomeMeta2';
import HeroSection2 from '@/parts/home2/heroSection2';
import classes from '@/styles/home2.module.css';
import pageClasses from '@/styles/responsive.module.css';
import { LanguageEnum } from '@/types/localization';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { getHomepageHeadline } from '@/utils/blogs';

type Props = {
  headlines: { label: string; link: string; tag: string }[];
};

export default function Homepage2(props: Props) {
  const { headlines } = props;
  const { locale } = useGlobalLocale();
  const resolvedLocale = locale || LanguageEnum.ENGLISH;

  return (
    <Layout headerClassName={pageClasses.homeContainer}>
      <main className={classes.homepageContainer}>
        <HomeMeta2 locale={resolvedLocale} />
        <HeroSection2 headlines={headlines} locale={resolvedLocale} />
        {/* Sections 2-9 added in later tasks */}
      </main>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const { headlines } = getHomepageHeadline();
  return { props: { headlines } };
};
```

### - [ ] Step 8: Run smoke tests

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: Both the shell test and the hero test PASS.

### - [ ] Step 9: Commit (ask user first)

Pause and ask the user:
> "Task 2 complete — Hero section renders with placeholder CTA and Attu image. Smoke tests pass. Commit now?"

If approved:
```bash
git add src/parts/home2/heroSection2/ src/pages/index2.tsx \
        src/i18n/en/home2.json public/images/home2/hero-attu-search.svg \
        tests/index2.smoke.test.js
git commit -m "feat(home2): add Hero section with Attu placeholder and copy-command CTA"
```

---

## Task 3: Capability Pillars (4 cards)

**Purpose:** Implement spec §5.2. Four cards: Hybrid Search, Built-in Embeddings, Agent Memory, MCP-Native. Each has icon, title, body, code snippet, `Learn more →`.

**Files:**
- Create: `src/parts/home2/capabilityPillars/index.tsx`
- Create: `src/parts/home2/capabilityPillars/index.module.css`
- Create: `src/parts/home2/capabilityPillars/const.ts`
- Modify: `src/i18n/en/home2.json` — add `pillars` keys
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

Append to `tests/index2.smoke.test.js`:

```javascript
test.describe('/index2 capability pillars', () => {
  test('renders all four pillar titles', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText('Hybrid Search, Built-in')).toBeVisible();
    await expect(page.getByText('Embeddings Without the Pipeline')).toBeVisible();
    await expect(page.getByText('Memory That Scales With Your Agent')).toBeVisible();
    await expect(page.getByText('MCP-Native')).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: `/index2 capability pillars` FAILS (titles not yet rendered).

### - [ ] Step 3: Add `pillars` block to `src/i18n/en/home2.json`

Insert under the existing keys:

```json
"pillars": {
  "sectionTitle": "Built for the Agent Era",
  "sectionSubtitle": "Four capabilities that make Milvus drop-in for modern AI applications.",
  "learnMore": "Learn more →",
  "hybrid": {
    "title": "Hybrid Search, Built-in",
    "body": "Combine semantic (dense), keyword (BM25 sparse), and rerankers in one query. No external Elasticsearch. Better RAG answers out of the box."
  },
  "embeddings": {
    "title": "Embeddings Without the Pipeline",
    "body": "Call OpenAI, Cohere, BGE, Jina, or local models directly inside Milvus. No separate embedding service to run and scale."
  },
  "memory": {
    "title": "Memory That Scales With Your Agent",
    "body": "Partition per user, per session, per tool. Session memory today, billions of long-term memories tomorrow — same API."
  },
  "mcp": {
    "title": "MCP-Native",
    "body": "Expose Milvus as an MCP server with one command. LangGraph, CrewAI, Claude Desktop, Cursor — all speak MCP."
  }
}
```

### - [ ] Step 4: Create `src/parts/home2/capabilityPillars/const.ts`

Code snippets here are **verbatim from the spec** and all require verification before launch. Do not change them without spec updates.

```typescript
// ⚠️ All code snippets below are marked `needs verification` in the spec.
// Do not modify without updating the spec first.

export type Pillar = {
  id: 'hybrid' | 'embeddings' | 'memory' | 'mcp';
  code: string;
  language: 'python' | 'bash';
  learnMoreHref: string;
};

export const PILLARS: Pillar[] = [
  {
    id: 'hybrid',
    language: 'python',
    learnMoreHref: '/docs/multi-vector-search.md', // ⚠️ verify
    code: `client.hybrid_search(
    "docs",
    [AnnSearchRequest(dense_vec, ...),
     AnnSearchRequest(sparse_vec, ...)],
    rerank=RRFRanker(),
)`,
  },
  {
    id: 'embeddings',
    language: 'python',
    learnMoreHref: '/docs/embedding-function-overview.md', // ⚠️ verify
    code: `schema.add_function(Function(
    name="embed",
    input_field_names=["text"],
    function_type=FunctionType.TEXT_EMBEDDING,
    params={"provider": "openai",
            "model": "text-embedding-3-small"},
))`,
  },
  {
    id: 'memory',
    language: 'python',
    learnMoreHref: '/docs/partition-key.md', // ⚠️ verify (agent memory guide may not exist yet)
    code: `client.insert("agent_memory",
    {"user_id": "u_123", "text": "...", "ts": now()})

client.search("agent_memory", queries=[...],
    filter='user_id == "u_123"')`,
  },
  {
    id: 'mcp',
    language: 'bash',
    learnMoreHref: 'https://github.com/zilliztech/mcp-server-milvus', // ⚠️ verify URL
    code: `uvx mcp-server-milvus --uri http://localhost:19530`,
  },
];
```

### - [ ] Step 5: Create `src/parts/home2/capabilityPillars/index.module.css`

```css
.section {
  padding: 96px 0;
  background: #f8fafc;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 40px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 18px;
  color: #475569;
  max-width: 640px;
  margin: 0 auto;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cardTitle {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
}

.cardBody {
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
}

.codeBlock {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  white-space: pre;
  overflow-x: auto;
}

.learnMore {
  color: #1d4ed8;
  font-size: 14px;
  text-decoration: none;
}

.learnMore:hover {
  text-decoration: underline;
}
```

### - [ ] Step 6: Create `src/parts/home2/capabilityPillars/index.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { PILLARS } from './const';

export default function CapabilityPillars() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('pillars.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('pillars.sectionSubtitle')}</p>
        </div>
        <div className={classes.grid}>
          {PILLARS.map(pillar => (
            <article className={classes.card} key={pillar.id}>
              <h3 className={classes.cardTitle}>{t(`pillars.${pillar.id}.title`)}</h3>
              <p className={classes.cardBody}>{t(`pillars.${pillar.id}.body`)}</p>
              <pre className={classes.codeBlock}>
                <code>{pillar.code}</code>
              </pre>
              <a
                href={pillar.learnMoreHref}
                className={classes.learnMore}
                target={pillar.learnMoreHref.startsWith('http') ? '_blank' : undefined}
                rel={pillar.learnMoreHref.startsWith('http') ? 'noreferrer' : undefined}
              >
                {t('pillars.learnMore')}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire into `src/pages/index2.tsx`

Add the import and the component right after `HeroSection2`:

```typescript
import CapabilityPillars from '@/parts/home2/capabilityPillars';
```

```typescript
<HeroSection2 headlines={headlines} locale={resolvedLocale} />
<CapabilityPillars />
```

### - [ ] Step 8: Run smoke tests

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: All three test blocks PASS.

### - [ ] Step 9: Commit (ask user first)

> "Task 3 complete — Capability Pillars section renders 4 cards. Commit now?"

```bash
git add src/parts/home2/capabilityPillars/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add capability pillars section"
```

---

## Task 4: Agent-Native Code Walkthrough

**Purpose:** Implement spec §5.3. Four tabs: Add Memory, Semantic Recall, Multi-tenant Isolation, Serve as MCP Server. Reuse visual pattern from existing `CodeExampleSection` (tabs + code block + right-side note).

**Files:**
- Create: `src/parts/home2/codeWalkthrough/index.tsx`
- Create: `src/parts/home2/codeWalkthrough/index.module.css`
- Create: `src/parts/home2/codeWalkthrough/const.ts`
- Modify: `src/i18n/en/home2.json` — add `walkthrough` keys
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 code walkthrough', () => {
  test('renders tab labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByRole('button', { name: /Add Memory/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Semantic Recall/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Multi-tenant/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /MCP Server/i })).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: `/index2 code walkthrough` FAILS.

### - [ ] Step 3: Add i18n keys

Insert into `src/i18n/en/home2.json`:

```json
"walkthrough": {
  "sectionTitle": "Start building your AI app in minutes",
  "sectionSubtitle": "Four snippets that cover the real Agent workflow.",
  "tabs": {
    "addMemory": "Add Memory",
    "semanticRecall": "Semantic Recall",
    "multiTenant": "Multi-tenant Isolation",
    "mcpServer": "Serve as MCP Server"
  },
  "notes": {
    "addMemory": "Start a local Milvus with docker-compose and you're running in under a minute.",
    "semanticRecall": "Hybrid search, filters, and rerank are one flag away when you need better recall.",
    "multiTenant": "Partition Key + Resource Groups give you per-tenant isolation without running a cluster per customer.",
    "mcpServer": "Any MCP-aware agent can now read and write your Milvus data as tools."
  }
}
```

### - [ ] Step 4: Create `src/parts/home2/codeWalkthrough/const.ts`

```typescript
// ⚠️ All code snippets below are marked `needs verification` in the spec.
// All snippets use uri="http://localhost:19530" — do NOT use Milvus Lite.

export const CODE_ADD_MEMORY = `from pymilvus import MilvusClient

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
])`;

export const CODE_SEMANTIC_RECALL = `results = client.search(
    "agent_memory",
    data=["What are the user's UI preferences?"],
    limit=5,
    filter='user_id == "u_123"',
    output_fields=["text", "ts"],
)

for hit in results[0]:
    print(hit["entity"]["text"], hit["distance"])`;

export const CODE_MULTI_TENANT = `client.create_collection(
    "agent_memory",
    dimension=1536,
    partition_key_field="user_id",
    num_partitions=64,
)`;

export const CODE_MCP_SERVER = `# Launch Milvus as an MCP server (one command)
uvx mcp-server-milvus --uri http://localhost:19530

# Claude Desktop, Cursor, LangGraph, CrewAI — all connect directly`;
```

### - [ ] Step 5: Create `src/parts/home2/codeWalkthrough/index.module.css`

```css
.section {
  padding: 96px 0;
  background: #ffffff;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 17px;
  color: #475569;
}

.container {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 32px;
  background: #0f172a;
  border-radius: 12px;
  padding: 24px;
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
}

.tabs {
  display: flex;
  gap: 8px;
  grid-column: 1 / -1;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.tab {
  padding: 8px 16px;
  border-radius: 6px;
  color: #cbd5e1;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
}

.tabActive {
  background: #1e293b;
  color: #f8fafc;
  border-color: #334155;
}

.codeBlock {
  background: #020617;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  white-space: pre;
  overflow-x: auto;
  min-height: 240px;
}

.note {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
  padding: 16px;
  border-left: 2px solid #334155;
}
```

### - [ ] Step 6: Create `src/parts/home2/codeWalkthrough/index.tsx`

```typescript
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import {
  CODE_ADD_MEMORY,
  CODE_SEMANTIC_RECALL,
  CODE_MULTI_TENANT,
  CODE_MCP_SERVER,
} from './const';

type TabId = 'addMemory' | 'semanticRecall' | 'multiTenant' | 'mcpServer';

const CODE_MAP: Record<TabId, string> = {
  addMemory: CODE_ADD_MEMORY,
  semanticRecall: CODE_SEMANTIC_RECALL,
  multiTenant: CODE_MULTI_TENANT,
  mcpServer: CODE_MCP_SERVER,
};

const TAB_ORDER: TabId[] = ['addMemory', 'semanticRecall', 'multiTenant', 'mcpServer'];

export default function CodeWalkthrough() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [active, setActive] = useState<TabId>('addMemory');

  const code = useMemo(() => CODE_MAP[active], [active]);
  const note = useMemo(() => t(`walkthrough.notes.${active}`), [active, t]);

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('walkthrough.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('walkthrough.sectionSubtitle')}</p>
        </div>

        <div className={classes.container}>
          <div className={classes.tabs}>
            {TAB_ORDER.map(tabId => (
              <button
                key={tabId}
                type="button"
                onClick={() => setActive(tabId)}
                className={clsx(classes.tab, active === tabId && classes.tabActive)}
              >
                {t(`walkthrough.tabs.${tabId}`)}
              </button>
            ))}
          </div>

          <pre className={classes.codeBlock}>
            <code>{code}</code>
          </pre>

          <aside className={classes.note}>{note}</aside>
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire into `src/pages/index2.tsx`

```typescript
import CodeWalkthrough from '@/parts/home2/codeWalkthrough';
```

```typescript
<CapabilityPillars />
<CodeWalkthrough />
```

### - [ ] Step 8: Run smoke tests

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: All four test blocks PASS.

### - [ ] Step 9: Commit (ask user first)

> "Task 4 complete — Code Walkthrough section. Commit now?"

```bash
git add src/parts/home2/codeWalkthrough/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add agent-native code walkthrough section"
```

---

## Task 5: Architecture Section

**Purpose:** Implement spec §5.4. Architecture diagram + 4 pillar cards + benchmark strip.

**Files:**
- Create: `src/parts/home2/architectureSection/index.tsx`
- Create: `src/parts/home2/architectureSection/index.module.css`
- Create: `src/parts/home2/architectureSection/diagram.tsx`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 architecture', () => {
  test('renders architecture header and pillars', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Built for the Real Scale of AI/i)).toBeVisible();
    await expect(page.getByText(/Storage–Compute Disaggregation/)).toBeVisible();
    await expect(page.getByText(/Billion-Scale at a Fraction of the Cost/)).toBeVisible();
    await expect(page.getByText(/Multi-Tenant by Design/)).toBeVisible();
    await expect(page.getByText(/Deploy Anywhere, Same API/)).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```

### - [ ] Step 3: Add i18n keys

Insert into `src/i18n/en/home2.json`:

```json
"architecture": {
  "sectionTitle": "Built for the Real Scale of AI — Without the Real Cost",
  "sectionSubtitle": "Milvus 2.6 rebuilt the streaming and storage layers from the ground up to run billion-scale vector workloads on cheap object storage.",
  "pillars": {
    "disaggregation": {
      "title": "Storage–Compute Disaggregation",
      "body": "Query, data, and streaming nodes scale independently on top of cheap object storage."
    },
    "scale": {
      "title": "Billion-Scale at a Fraction of the Cost",
      "body": "Milvus 2.6's new Woodpecker WAL replaces Kafka/Pulsar — zero-disk, cloud-native, dramatically cheaper at scale."
    },
    "tenant": {
      "title": "Multi-Tenant by Design",
      "body": "Partition Key + Resource Groups — one cluster, thousands of tenants, full isolation."
    },
    "deploy": {
      "title": "Deploy Anywhere, Same API",
      "body": "Standalone on a single box, Distributed on Kubernetes, or Zilliz Cloud — same MilvusClient code."
    }
  },
  "benchmark": {
    "latency": "Sub-XX ms p99",
    "scale": "Billion-scale tested",
    "cost": "~XX% lower infra cost vs 2.5",
    "clouds": "AWS · GCP · Azure · BYOC"
  }
}
```

**Note:** All four `benchmark.*` values contain `XX` placeholders intentionally — per spec §11, these are `⚠️ needs verification` and must stay literal until engineering provides real numbers.

### - [ ] Step 4: Create `src/parts/home2/architectureSection/diagram.tsx`

Static SVG for now. Animation can be added later using Framer Motion — not required for launch-gate MVP.

```typescript
// ⚠️ PLACEHOLDER: final design should produce an animated SVG/Lottie asset
// per spec §5.4. This is a simplified static version for the /index2 preview.

export default function ArchitectureDiagram() {
  return (
    <svg
      viewBox="0 0 720 520"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      role="img"
      aria-label="Milvus 2.6 four-layer architecture: Access, Coordinator, Worker, Storage"
    >
      {/* Access Layer */}
      <rect x="260" y="20" width="200" height="48" rx="6" fill="#dbeafe" stroke="#1d4ed8" />
      <text x="360" y="50" textAnchor="middle" fontSize="14" fill="#1e3a8a">
        Proxy Service (Access)
      </text>

      {/* Coordinator */}
      <rect x="140" y="100" width="440" height="56" rx="6" fill="#fef3c7" stroke="#b45309" />
      <text x="360" y="125" textAnchor="middle" fontSize="13" fill="#78350f">
        Coordinator (RootCoord · DataCoord · QueryCoord · Streaming Coord)
      </text>
      <text x="360" y="145" textAnchor="middle" fontSize="11" fill="#92400e">
        single active
      </text>

      {/* Workers */}
      <rect x="60" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="150" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        QueryNode
      </text>
      <text x="150" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        vector + scalar search
      </text>

      <rect x="270" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="360" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        DataNode
      </text>
      <text x="360" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        flush binlogs
      </text>

      <rect x="480" y="200" width="180" height="60" rx="6" fill="#dcfce7" stroke="#166534" />
      <text x="570" y="225" textAnchor="middle" fontSize="13" fill="#14532d">
        StreamingNode
      </text>
      <text x="570" y="245" textAnchor="middle" fontSize="11" fill="#166534">
        WAL · growing data (2.6 NEW)
      </text>

      {/* Storage */}
      <rect x="20" y="320" width="680" height="80" rx="6" fill="#ede9fe" stroke="#6d28d9" />
      <text x="360" y="350" textAnchor="middle" fontSize="14" fill="#4c1d95">
        Storage
      </text>
      <text x="360" y="370" textAnchor="middle" fontSize="12" fill="#5b21b6">
        Object Storage (S3 · GCS · MinIO · Azure · OSS) · etcd · Woodpecker (WAL)
      </text>

      {/* Connectors */}
      <line x1="360" y1="68" x2="360" y2="100" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="150" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="360" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="156" x2="570" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <line x1="150" y1="260" x2="150" y2="320" stroke="#64748b" strokeWidth="1.5" />
      <line x1="360" y1="260" x2="360" y2="320" stroke="#64748b" strokeWidth="1.5" />
      <line x1="570" y1="260" x2="570" y2="320" stroke="#64748b" strokeWidth="1.5" />
    </svg>
  );
}
```

### - [ ] Step 5: Create `src/parts/home2/architectureSection/index.module.css`

```css
.section {
  padding: 96px 0;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #f8fafc;
}

.subtitle {
  font-size: 17px;
  color: #cbd5e1;
  max-width: 760px;
  margin: 0 auto;
}

.diagramWrap {
  max-width: 800px;
  margin: 0 auto 48px;
  background: #0b1220;
  border: 1px solid #1f2937;
  border-radius: 12px;
  padding: 24px;
}

.pillarGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}

@media (max-width: 1024px) {
  .pillarGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .pillarGrid {
    grid-template-columns: 1fr;
  }
}

.pillarCard {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 20px;
}

.pillarTitle {
  font-size: 16px;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 8px;
}

.pillarBody {
  font-size: 14px;
  line-height: 1.6;
  color: #cbd5e1;
}

.benchmarkStrip {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  padding: 20px 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 14px;
}

.benchmarkStrip > span {
  white-space: nowrap;
}
```

### - [ ] Step 6: Create `src/parts/home2/architectureSection/index.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import ArchitectureDiagram from './diagram';

const PILLAR_KEYS = ['disaggregation', 'scale', 'tenant', 'deploy'] as const;

export default function ArchitectureSection() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('architecture.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('architecture.sectionSubtitle')}</p>
        </div>

        <div className={classes.diagramWrap}>
          <ArchitectureDiagram />
        </div>

        <div className={classes.pillarGrid}>
          {PILLAR_KEYS.map(key => (
            <article className={classes.pillarCard} key={key}>
              <h3 className={classes.pillarTitle}>
                {t(`architecture.pillars.${key}.title`)}
              </h3>
              <p className={classes.pillarBody}>
                {t(`architecture.pillars.${key}.body`)}
              </p>
            </article>
          ))}
        </div>

        <div className={classes.benchmarkStrip}>
          <span>⚡ {t('architecture.benchmark.latency')}</span>
          <span>📦 {t('architecture.benchmark.scale')}</span>
          <span>💰 {t('architecture.benchmark.cost')}</span>
          <span>🛰 {t('architecture.benchmark.clouds')}</span>
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire into `src/pages/index2.tsx`

```typescript
import ArchitectureSection from '@/parts/home2/architectureSection';
```

```typescript
<CodeWalkthrough />
<ArchitectureSection />
```

### - [ ] Step 8: Run smoke tests and verify PASS

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```

### - [ ] Step 9: Commit (ask user first)

> "Task 5 complete — Architecture section. Commit now?"

```bash
git add src/parts/home2/architectureSection/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add architecture section with diagram and pillars"
```

---

## Task 6: Ecosystem Matrix

**Purpose:** Implement spec §5.5. Five categories: Agent Frameworks / Model APIs / RAG Stacks / Protocols / Eval & Observability. Desktop: stacked categories. Mobile: accordion.

**Files:**
- Create: `src/parts/home2/ecosystemMatrix/index.tsx`
- Create: `src/parts/home2/ecosystemMatrix/index.module.css`
- Create: `src/parts/home2/ecosystemMatrix/const.ts`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 ecosystem', () => {
  test('renders all five category headers', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText('Agent Frameworks')).toBeVisible();
    await expect(page.getByText('Model APIs')).toBeVisible();
    await expect(page.getByText('RAG Stacks')).toBeVisible();
    await expect(page.getByText('Protocols')).toBeVisible();
    await expect(page.getByText('Eval & Observability')).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

### - [ ] Step 3: Add i18n keys

```json
"ecosystem": {
  "sectionTitle": "Plugs Into Your Entire AI Stack",
  "sectionSubtitle": "Drop Milvus into the agent framework, model API, RAG tool, or protocol you already use.",
  "categories": {
    "agent": "Agent Frameworks",
    "model": "Model APIs",
    "rag": "RAG Stacks",
    "protocols": "Protocols",
    "eval": "Eval & Observability"
  },
  "emptyGap": "⚠️ Coming soon — integrations being finalized"
}
```

### - [ ] Step 4: Create `src/parts/home2/ecosystemMatrix/const.ts`

Only existing logos (per spec §5.5 and user decision). Empty categories are flagged.

```typescript
import {
  MILVUS_INTEGRATION_LANGCHAIN_LINK,
  MILVUS_INTEGRATION_DSPY_LINK,
  MILVUS_INTEGRATION_HAYSTACK_LINK,
  MILVUS_INTEGRATION_HUGGING_FACE_LINK,
  MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
  MILVUS_INTEGRATION_MEMGPT_LINK,
  MILVUS_INTEGRATION_OPENAI_LINK,
  MILVUS_INTEGRATION_RAGAS_LINK,
} from '@/consts/links';

export type Logo = { name: string; logo: string; href: string };

export type CategoryId = 'agent' | 'model' | 'rag' | 'protocols' | 'eval';

export const CATEGORIES: { id: CategoryId; logos: Logo[] }[] = [
  {
    id: 'agent',
    logos: [
      {
        name: 'MemGPT',
        logo: '/images/home/mem-gpt.png',
        href: MILVUS_INTEGRATION_MEMGPT_LINK,
      },
      // ⚠️ Gap: add LangGraph, CrewAI, AutoGen, Mastra, Pydantic AI before public launch (spec §11).
    ],
  },
  {
    id: 'model',
    logos: [
      {
        name: 'OpenAI',
        logo: '/images/home/open-ai.png',
        href: MILVUS_INTEGRATION_OPENAI_LINK,
      },
      {
        name: 'Hugging Face',
        logo: '/images/home/hugging-face.png',
        href: MILVUS_INTEGRATION_HUGGING_FACE_LINK,
      },
    ],
  },
  {
    id: 'rag',
    logos: [
      {
        name: 'LangChain',
        logo: '/images/home/lang-chain.png',
        href: MILVUS_INTEGRATION_LANGCHAIN_LINK,
      },
      {
        name: 'LlamaIndex',
        logo: '/images/home/llama-index.png',
        href: MILVUS_INTEGRATION_LLAMA_INDEX_LINK,
      },
      {
        name: 'Haystack',
        logo: '/images/home/hay-stack.png',
        href: MILVUS_INTEGRATION_HAYSTACK_LINK,
      },
      {
        name: 'DSPy',
        logo: '/images/home/dspy.png',
        href: MILVUS_INTEGRATION_DSPY_LINK,
      },
    ],
  },
  {
    id: 'protocols',
    logos: [
      // ⚠️ Gap: add MCP, A2A before public launch (spec §11).
    ],
  },
  {
    id: 'eval',
    logos: [
      {
        name: 'Ragas',
        logo: '/images/home/ragas.png',
        href: MILVUS_INTEGRATION_RAGAS_LINK,
      },
    ],
  },
];
```

### - [ ] Step 5: Create `src/parts/home2/ecosystemMatrix/index.module.css`

```css
.section {
  padding: 96px 0;
  background: #ffffff;
}

.header {
  text-align: center;
  margin-bottom: 48px;
}

.title {
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 17px;
  color: #475569;
  max-width: 640px;
  margin: 0 auto;
}

.category {
  border-top: 1px solid #e2e8f0;
  padding: 24px 0;
}

.categoryHeader {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 16px;
}

.logoRow {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
}

.logoLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.logoLink:hover {
  border-color: #cbd5e1;
  background: #ffffff;
}

.logoImg {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.emptyNote {
  color: #94a3b8;
  font-size: 14px;
  font-style: italic;
}

/* mobile: accordion */
@media (max-width: 768px) {
  .categoryHeader {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category[data-open="false"] .logoRow {
    display: none;
  }

  .chevron::after {
    content: "▸";
    display: inline-block;
  }

  .category[data-open="true"] .chevron::after {
    content: "▾";
  }
}
```

### - [ ] Step 6: Create `src/parts/home2/ecosystemMatrix/index.tsx`

```typescript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';
import { CATEGORIES, CategoryId } from './const';

export default function EcosystemMatrix() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [openMobile, setOpenMobile] = useState<Record<CategoryId, boolean>>({
    agent: true,
    model: false,
    rag: false,
    protocols: false,
    eval: false,
  });

  const toggle = (id: CategoryId) =>
    setOpenMobile(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.header}>
          <h2 className={classes.title}>{t('ecosystem.sectionTitle')}</h2>
          <p className={classes.subtitle}>{t('ecosystem.sectionSubtitle')}</p>
        </div>

        {CATEGORIES.map(({ id, logos }) => (
          <div
            key={id}
            className={classes.category}
            data-open={openMobile[id] ? 'true' : 'false'}
          >
            <h3 className={classes.categoryHeader} onClick={() => toggle(id)}>
              <span>{t(`ecosystem.categories.${id}`)}</span>
              <span className={classes.chevron} aria-hidden />
            </h3>
            <div className={classes.logoRow}>
              {logos.length === 0 ? (
                <span className={classes.emptyNote}>{t('ecosystem.emptyGap')}</span>
              ) : (
                logos.map(logo => (
                  <a
                    key={logo.name}
                    href={logo.href}
                    target="_blank"
                    rel="noreferrer"
                    className={classes.logoLink}
                  >
                    <img
                      src={logo.logo}
                      alt={logo.name}
                      className={classes.logoImg}
                      width={80}
                      height={40}
                      loading="lazy"
                    />
                  </a>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire into `src/pages/index2.tsx`

```typescript
import EcosystemMatrix from '@/parts/home2/ecosystemMatrix';
```

```typescript
<ArchitectureSection />
<EcosystemMatrix />
```

### - [ ] Step 8: Run smoke tests

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```

### - [ ] Step 9: Commit (ask user first)

> "Task 6 complete — Ecosystem Matrix. Commit now?"

```bash
git add src/parts/home2/ecosystemMatrix/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add categorized ecosystem matrix"
```

---

## Task 7: Production Section 2 (numbers strip + logo wall)

**Purpose:** Implement spec §5.6. Hard-data strip above a customer-logo wall.

**Files:**
- Create: `src/parts/home2/productionSection2/index.tsx`
- Create: `src/parts/home2/productionSection2/index.module.css`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 production', () => {
  test('renders trusted-in-production heading and numbers strip', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Trusted in production/i)).toBeVisible();
    await expect(page.getByText('25M+')).toBeVisible();
    await expect(page.getByText('35K+')).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

### - [ ] Step 3: Check for existing global stats

Open `global-stats.json` at the repo root:
```bash
cat global-stats.json
```
If it contains `downloads` / `stars` keys, use them via a simple JSON import; if not, use hardcoded strings `25M+` and `35K+` for this MVP (noted in spec §5.6 as acceptable).

### - [ ] Step 4: Add i18n keys

```json
"production": {
  "sectionTitle": "Trusted in production by the teams building AI",
  "metrics": {
    "downloads": "downloads",
    "stars": "GitHub stars",
    "customers": "Fortune 500 customers",
    "scale": "vectors served"
  },
  "placeholders": {
    "customers": "XX+",
    "scale": "XX billion"
  }
}
```

### - [ ] Step 5: Create `src/parts/home2/productionSection2/index.module.css`

```css
.section {
  padding: 80px 0;
  background: #f8fafc;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 40px;
}

.numbersStrip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  padding: 32px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 48px;
}

@media (max-width: 768px) {
  .numbersStrip {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric {
  text-align: center;
}

.metricValue {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  display: block;
}

.metricLabel {
  font-size: 13px;
  color: #475569;
  margin-top: 4px;
}

.logoWall {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
}

.logoItem {
  height: 48px;
  width: auto;
}
```

### - [ ] Step 6: Create `src/parts/home2/productionSection2/index.tsx`

Customer logo assets and list — to avoid touching `src/parts/home/productionSection`, duplicate the asset list. Before coding, list what `public/images/home/` holds for production logos:

```bash
ls public/images/home | grep -E 'production|customer|logo' | head -20
```

If you find files like `nvidia.png`, `salesforce.png`, etc., include them in the list below. Otherwise use the list the current `ProductionSection` renders — open `src/parts/home/productionSection/ProductionSection.tsx` and mirror the asset paths (read-only; do not modify).

```typescript
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

type Metric = {
  value: string;
  labelKey: 'downloads' | 'stars' | 'customers' | 'scale';
  isPlaceholder?: boolean;
};

const METRICS: Metric[] = [
  { value: '25M+', labelKey: 'downloads' },
  { value: '35K+', labelKey: 'stars' },
  { value: 'XX+', labelKey: 'customers', isPlaceholder: true },
  { value: 'XX billion', labelKey: 'scale', isPlaceholder: true },
];

// ⚠️ Replace this list with the actual production logo asset paths
// (mirror src/parts/home/productionSection — read-only reference).
const LOGO_PATHS: { src: string; alt: string }[] = [
  // Example — adjust to match the existing asset list:
  // { src: '/images/home/customers/nvidia.svg', alt: 'NVIDIA' },
];

export default function ProductionSection2() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <h2 className={classes.title}>{t('production.sectionTitle')}</h2>

        <div className={classes.numbersStrip}>
          {METRICS.map(m => (
            <div className={classes.metric} key={m.labelKey}>
              <span className={classes.metricValue}>{m.value}</span>
              <span className={classes.metricLabel}>
                {t(`production.metrics.${m.labelKey}`)}
              </span>
            </div>
          ))}
        </div>

        <div className={classes.logoWall}>
          {LOGO_PATHS.map(l => (
            <img key={l.src} src={l.src} alt={l.alt} className={classes.logoItem} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 7: Wire into `src/pages/index2.tsx`

```typescript
import ProductionSection2 from '@/parts/home2/productionSection2';
```

```typescript
<EcosystemMatrix />
<ProductionSection2 />
```

### - [ ] Step 8: Run smoke tests

### - [ ] Step 9: Commit (ask user first)

> "Task 7 complete — Production section. Commit now?"

```bash
git add src/parts/home2/productionSection2/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add production section with numbers strip"
```

---

## Task 8: Loved by Developers (duplicated component)

**Purpose:** Implement spec §5.7. Three testimonial cards — content identical to current `LovedSection`. Duplicate the component shape into `home2/lovedSection2/`.

**Files:**
- Create: `src/parts/home2/lovedSection2/index.tsx`
- Create: `src/parts/home2/lovedSection2/index.module.css`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 loved', () => {
  test('renders Loved by Developers and three authors', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Loved by GenAI developers/i)).toBeVisible();
    await expect(page.getByText(/Nandula Asel/)).toBeVisible();
    await expect(page.getByText(/Bhargav Mankad/)).toBeVisible();
    await expect(page.getByText(/Igor Gorbenko/)).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

### - [ ] Step 3: Add i18n keys (copy verbatim from `home.json` lovedSection)

```json
"loved": {
  "title": "Loved by GenAI developers",
  "cards": {
    "nandula": {
      "content": "Based on our research, Milvus was selected as the vector database of choice (over Chroma and Pinecone). Milvus is an open-source vector database designed specifically for similarity search on massive datasets of high-dimensional vectors.",
      "author": "Nandula Asel",
      "title": "Senior Data Scientist"
    },
    "bhargav": {
      "content": "With its focus on efficient vector similarity search, Milvus empowers you to build robust and scalable image retrieval systems. Whether you're managing a personal photo library or developing a commercial image search application, Milvus offers a powerful foundation for unlocking the hidden potential within your image collections.",
      "author": "Bhargav Mankad",
      "title": "Senior Solution Architect"
    },
    "igor": {
      "content": "Milvus is a powerful vector database tailored for processing and searching extensive vector data. It stands out for its high performance and scalability, rendering it perfect for machine learning, deep learning, similarity search tasks, and recommendation systems.",
      "author": "Igor Gorbenko",
      "title": "Big Data Architect"
    }
  }
}
```

### - [ ] Step 4: Create `src/parts/home2/lovedSection2/index.module.css`

```css
.section {
  padding: 96px 0;
  background: #ffffff;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content {
  font-size: 15px;
  line-height: 1.6;
  color: #334155;
  flex: 1;
}

.author {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.jobTitle {
  font-size: 13px;
  color: #64748b;
}
```

### - [ ] Step 5: Create `src/parts/home2/lovedSection2/index.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

const CARD_KEYS = ['nandula', 'bhargav', 'igor'] as const;

export default function LovedSection2() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <h2 className={classes.title}>{t('loved.title')}</h2>
        <div className={classes.grid}>
          {CARD_KEYS.map(key => (
            <article className={classes.card} key={key}>
              <p className={classes.content}>
                {t(`loved.cards.${key}.content`)}
              </p>
              <div>
                <div className={classes.author}>
                  {t(`loved.cards.${key}.author`)}
                </div>
                <div className={classes.jobTitle}>
                  {t(`loved.cards.${key}.title`)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 6: Wire into `src/pages/index2.tsx`

```typescript
import LovedSection2 from '@/parts/home2/lovedSection2';
```

```typescript
<ProductionSection2 />
<LovedSection2 />
```

### - [ ] Step 7: Run smoke tests

### - [ ] Step 8: Commit (ask user first)

> "Task 8 complete — Loved by Developers. Commit now?"

```bash
git add src/parts/home2/lovedSection2/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add loved-by-developers section"
```

---

## Task 9: Community & Meetups

**Purpose:** Implement spec §5.8. Two-column: community stats (left) + meetups (right).

**Files:**
- Create: `src/parts/home2/communityMeetups/index.tsx`
- Create: `src/parts/home2/communityMeetups/index.module.css`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 community', () => {
  test('renders community stats and meetups card', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Unstructured Data Meetups/i)).toBeVisible();
    await expect(page.getByText('GitHub stars')).toBeVisible();
    await expect(page.getByText('downloads')).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

### - [ ] Step 3: Add i18n keys

```json
"community": {
  "stats": {
    "title": "Join the community",
    "stars": "GitHub stars",
    "contributors": "contributors",
    "downloads": "downloads",
    "chat": "Discord / Forum"
  },
  "contributorsPlaceholder": "XXX+",
  "meetups": {
    "title": "Unstructured Data Meetups",
    "desc": "Join a community of passionate developers and engineers dedicated to Gen AI.",
    "cta": "Explore meetups →"
  }
}
```

### - [ ] Step 4: Create `src/parts/home2/communityMeetups/index.module.css`

```css
.section {
  padding: 96px 0;
  background: #f8fafc;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 32px;
}

.cardTitle {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

.statRow {
  display: flex;
  gap: 12px;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.statRow:last-child {
  border-bottom: none;
}

.statValue {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  min-width: 80px;
}

.statLabel {
  color: #475569;
  font-size: 14px;
}

.meetupDesc {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin-bottom: 20px;
}

.meetupCta {
  color: #1d4ed8;
  font-weight: 500;
  text-decoration: none;
}

.meetupCta:hover {
  text-decoration: underline;
}
```

### - [ ] Step 5: Create `src/parts/home2/communityMeetups/index.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import classes from './index.module.css';

export default function CommunityMeetups() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <div className={classes.grid}>
          <article className={classes.card}>
            <h3 className={classes.cardTitle}>{t('community.stats.title')}</h3>
            <div className={classes.statRow}>
              <span className={classes.statValue}>35K+</span>
              <span className={classes.statLabel}>
                ⭐ {t('community.stats.stars')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>
                {t('community.contributorsPlaceholder')}
              </span>
              <span className={classes.statLabel}>
                👥 {t('community.stats.contributors')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>25M+</span>
              <span className={classes.statLabel}>
                📥 {t('community.stats.downloads')}
              </span>
            </div>
            <div className={classes.statRow}>
              <span className={classes.statValue}>💬</span>
              <span className={classes.statLabel}>{t('community.stats.chat')}</span>
            </div>
          </article>

          <article className={classes.card}>
            <h3 className={classes.cardTitle}>{t('community.meetups.title')}</h3>
            <p className={classes.meetupDesc}>{t('community.meetups.desc')}</p>
            <a
              href="https://zilliz.com/community/unstructured-data-meetup"
              className={classes.meetupCta}
              target="_blank"
              rel="noreferrer"
            >
              {t('community.meetups.cta')}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 6: Wire into `src/pages/index2.tsx`

```typescript
import CommunityMeetups from '@/parts/home2/communityMeetups';
```

```typescript
<LovedSection2 />
<CommunityMeetups />
```

### - [ ] Step 7: Run smoke tests

### - [ ] Step 8: Commit (ask user first)

> "Task 9 complete — Community & Meetups. Commit now?"

```bash
git add src/parts/home2/communityMeetups/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add community stats and meetups section"
```

---

## Task 10: Final CTA

**Purpose:** Implement spec §5.9. Three starting-path cards (Python / Cloud / Docs). Python card command must match Hero placeholder.

**Files:**
- Create: `src/parts/home2/finalCTA/index.tsx`
- Create: `src/parts/home2/finalCTA/index.module.css`
- Modify: `src/i18n/en/home2.json`
- Modify: `src/pages/index2.tsx`
- Modify test: `tests/index2.smoke.test.js`

### - [ ] Step 1: Extend smoke test

```javascript
test.describe('/index2 final CTA', () => {
  test('renders three start paths', async ({ page }) => {
    await page.goto(`${BASE_URL}/index2`);
    await expect(page.getByText(/Start building in minutes/i)).toBeVisible();
    await expect(page.getByText(/Python/)).toBeVisible();
    await expect(page.getByText(/Cloud/)).toBeVisible();
    await expect(page.getByText(/Docs/)).toBeVisible();
  });
});
```

### - [ ] Step 2: Run test — expect failure

### - [ ] Step 3: Add i18n keys

```json
"finalCta": {
  "title": "Start building in minutes",
  "python": {
    "label": "Python",
    "body": "⚠️ PLACEHOLDER: Agent-ready CLI command TBD",
    "button": "Copy →"
  },
  "cloud": {
    "label": "Cloud",
    "body": "Try Zilliz Cloud Free",
    "button": "Sign up →"
  },
  "docs": {
    "label": "Docs",
    "body": "Read the docs",
    "button": "Browse →"
  }
}
```

Keep the Python body identical to `hero.ctaPlaceholder` — when the real command is decided, both keys update together.

### - [ ] Step 4: Create `src/parts/home2/finalCTA/index.module.css`

```css
.section {
  padding: 96px 0;
  background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
}

.title {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 48px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}

.icon {
  font-size: 32px;
}

.label {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
  font-weight: 600;
}

.body {
  font-size: 16px;
  color: #0f172a;
  font-family: monospace;
  word-break: break-all;
}

.button {
  margin-top: auto;
  display: inline-flex;
  padding: 10px 18px;
  background: #0f172a;
  color: #ffffff;
  border-radius: 8px;
  font-size: 14px;
  text-decoration: none;
  border: none;
  cursor: pointer;
}

.button:hover {
  opacity: 0.9;
}
```

### - [ ] Step 5: Create `src/parts/home2/finalCTA/index.tsx`

```typescript
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import pageClasses from '@/styles/responsive.module.css';
import { CLOUD_SIGNUP_LINK } from '@/consts/links';
import classes from './index.module.css';

export default function FinalCTA() {
  const { locale } = useGlobalLocale();
  const { t } = useTranslation('home2', { lng: locale });
  const [copied, setCopied] = useState(false);

  const pythonBody = t('finalCta.python.body');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pythonBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no-op */
    }
  };

  return (
    <section className={classes.section}>
      <div className={pageClasses.homeContainer}>
        <h2 className={classes.title}>{t('finalCta.title')}</h2>

        <div className={classes.grid}>
          <article className={classes.card}>
            <span className={classes.icon}>🐍</span>
            <span className={classes.label}>{t('finalCta.python.label')}</span>
            <code className={classes.body}>{pythonBody}</code>
            <button type="button" onClick={handleCopy} className={classes.button}>
              {copied ? 'Copied' : t('finalCta.python.button')}
            </button>
          </article>

          <article className={classes.card}>
            <span className={classes.icon}>☁️</span>
            <span className={classes.label}>{t('finalCta.cloud.label')}</span>
            <span className={classes.body}>{t('finalCta.cloud.body')}</span>
            <a
              href={`${CLOUD_SIGNUP_LINK}?utm_source=milvusio&utm_medium=referral&utm_campaign=milvus_homepage_final&utm_content=home2`}
              className={classes.button}
              target="_blank"
              rel="noreferrer"
            >
              {t('finalCta.cloud.button')}
            </a>
          </article>

          <article className={classes.card}>
            <span className={classes.icon}>📖</span>
            <span className={classes.label}>{t('finalCta.docs.label')}</span>
            <span className={classes.body}>{t('finalCta.docs.body')}</span>
            <a href="/docs" className={classes.button}>
              {t('finalCta.docs.button')}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
```

### - [ ] Step 6: Wire into `src/pages/index2.tsx`

```typescript
import FinalCTA from '@/parts/home2/finalCTA';
```

```typescript
<CommunityMeetups />
<FinalCTA />
```

### - [ ] Step 7: Run smoke tests

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: All test blocks PASS.

### - [ ] Step 8: Commit (ask user first)

> "Task 10 complete — Final CTA. Commit now?"

```bash
git add src/parts/home2/finalCTA/ src/pages/index2.tsx \
        src/i18n/en/home2.json tests/index2.smoke.test.js
git commit -m "feat(home2): add final CTA with three start paths"
```

---

## Task 11: Full-page audit + launch-gate checklist

**Purpose:** Final audit of the assembled `/index2` page. No new code — verification only.

**Files:** none modified.

### - [ ] Step 1: Run the full smoke suite

```bash
npx playwright test tests/index2.smoke.test.js --reporter=list
```
Expected: All test blocks PASS.

### - [ ] Step 2: Type-check and lint

```bash
pnpm lint
```
Expected: No new errors/warnings for any file under `src/pages/index2.tsx`, `src/parts/home2/**`, `src/i18n/en/home2.json`, `src/i18n/*/index.ts`, `tests/index2.smoke.test.js`.

### - [ ] Step 3: Build the site

```bash
pnpm build
```
Expected: Build succeeds. `/index2` is present in the built output. No regression for `/` (existing homepage still builds fine).

### - [ ] Step 4: Visual inspection in dev

```bash
pnpm dev:fe
```
Open `http://localhost:8000/index2` and scroll through all 9 sections. Check:
- Hero headline + subtitle render, Attu placeholder SVG visible, CTA button copies placeholder text on click.
- Capability pillars — 4 cards, code snippets readable.
- Code walkthrough — 4 tabs switch content and note.
- Architecture — diagram and 4 pillars, benchmark strip shows placeholder values literally.
- Ecosystem matrix — 5 categories, empty categories show the "coming soon" placeholder.
- Production — numbers strip renders with placeholder values for customers/scale.
- Loved — 3 testimonial cards, content identical to current `/`.
- Community — stats + meetups, side-by-side on desktop.
- Final CTA — 3 start cards, Python command matches Hero placeholder.

Also check:
- Mobile layout (`< 768px`): everything stacks. Ecosystem matrix categories collapse to accordion.
- No console errors in the browser.
- `/` (existing homepage) still renders correctly — no regression.

### - [ ] Step 5: Verify constraint compliance

Run the following and confirm each:

```bash
# 1. No modifications to src/parts/home/**
git diff HEAD -- src/parts/home/
# Expected: empty diff

# 2. No modifications to src/pages/index.tsx
git diff HEAD -- src/pages/index.tsx
# Expected: empty diff

# 3. No modifications to any src/i18n/*/home.json
git diff HEAD -- 'src/i18n/*/home.json'
# Expected: empty diff

# 4. No "milvus.db" / Milvus Lite strings in new code
grep -rn "milvus.db" src/parts/home2 src/pages/index2.tsx
# Expected: no matches
```

If any of these fail, the constraint is violated — fix before proceeding.

### - [ ] Step 6: Confirm all spec §11 open items are still flagged

Manually verify that these placeholders are rendered literally in the page (not accidentally replaced):
- Hero primary CTA: `⚠️ PLACEHOLDER: Agent-ready CLI command TBD`
- Final CTA Python body: same string
- Architecture benchmark: `Sub-XX ms p99` / `~XX% lower infra cost vs 2.5`
- Production metrics: `XX+` (customers), `XX billion` (scale)
- Community contributors: `XXX+`
- Ecosystem Protocols category: "Coming soon" placeholder

### - [ ] Step 7: Hand off to launch-gate reviewer

Produce a short handoff note listing every unresolved spec §11 open item, e.g.:

```
/index2 ready for preview. Blockers for public launch:
1. Hero / Final CTA: decide final agent-ready CLI command string.
2. Attu screenshot: replace /images/home2/hero-attu-search.svg with real PNG.
3. Architecture diagram: upgrade from static SVG to animated asset per spec §5.4.
4. Verify every pymilvus / MCP snippet in pillars + walkthrough against the
   published API. Replace any that do not run as written.
5. Real numbers for: Hero "100B+" claim, architecture benchmark strip,
   production customer count, production scale metric, community contributors.
6. Content expansion for Ecosystem Matrix: at minimum 3 logos each for
   Agent Frameworks and Protocols categories.
7. Confirm MCP server repo URL and update pillars/const.ts.
8. Confirm doc links for pillars (hybrid search / embedding function /
   agent memory guide).
```

### - [ ] Step 8: Commit the final audit state (ask user first)

> "Task 11 complete — /index2 is assembled and all constraints are satisfied. All spec §11 open items are still flagged. Commit the final state?"

If the audit produced no further file changes beyond what was committed in earlier tasks, nothing remains to commit. Otherwise:

```bash
git add <files changed during audit>
git commit -m "chore(home2): final audit fixes"
```

---

## Open Items (still require a non-engineering decision — inherited from spec §11)

These are reproduced here so the plan is self-contained. Every one blocks public launch:

1. **Hero + Final CTA CLI command** — final string decision.
2. **Attu screenshot asset** — real PNG.
3. **All code snippets** — run them; rewrite any that do not work as written.
4. **Architecture diagram** — final animated asset.
5. **Numeric claims** — `100B+`, `Sub-XX ms p99`, `~XX% cost reduction`, Fortune 500 count, scale metric, contributor count.
6. **Ecosystem logo expansion** — especially Agent Frameworks and Protocols.
7. **Testimonials** — explicitly kept as-is per user decision; may revisit.
8. **MCP server repo URL.**
9. **Doc-link targets** — for Hybrid Search, Embedding Functions, Agent Memory guide.
