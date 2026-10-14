# Milvus → Cloud attribution

`useCloudLinkTracking` applies one URL policy to Cloud signup/signin/login
anchors, including navigation, CTAs and rendered documentation HTML. It runs
after hydration, watches dynamically inserted/updated links, and decorates links
before clicks. Existing locale routing and targets are preserved. Cloud auth
links remove `noreferrer`, keep/add `noopener`, and use
`referrerpolicy="strict-origin-when-cross-origin"`: cross-domain requests carry
the referring origin, without the Milvus page path or query. Other `rel` tokens
are retained. Non-Cloud links, download links and code examples are unchanged.

## Field contract

- Standard `utm_*` campaign fields and supported click IDs retain the incoming
  acquisition values. The explicit whitelist lives in `cloud-attribution.ts`.
- `entry_site=milvus.io` identifies the referring website independently.
- `entry_page` identifies the Milvus page where the Cloud link was used. `/`,
  `/?...` and `/#...` all use `homepage`; other paths retain their locale/path
  and omit query strings and fragments. This is the exit page, not the original
  advertising landing page.
- `entry_button` identifies the CTA. Set `data-entry-button` explicitly when
  needed. Otherwise the existing Milvus `utm_campaign` button label is reused;
  unlabelled links fall back to `cloud_signup` or `cloud_signin`.

Example: an arrival with `utm_source=google&utm_medium=cpc&gclid=123`, followed
by the homepage navigation CTA, sends those acquisition values plus
`entry_site=milvus.io&entry_page=homepage&entry_button=milvus_nav_right`.

## Persistence and precedence

The latest tagged arrival is saved in `sessionStorage` for this browser tab.
Untagged pages and unrelated query parameters reuse that campaign. A new tagged
arrival replaces the whole saved campaign, avoiding stale click IDs or mixed
campaigns. This is latest-tagged attribution, not first-touch or multi-touch
attribution; an untagged return in the same tab retains the saved campaign.

When acquisition values exist, they replace the destination's hard-coded UTM
and click-ID fields. In particular, a click-ID-only arrival must not acquire
`utm_source=milvusio&utm_medium=referral`. Without acquisition values, existing
Milvus referral UTMs remain for compatibility, alongside the new entry fields.
Unrelated destination parameters are preserved. Arbitrary incoming page queries
are never forwarded.

If browser storage is unavailable, current-URL values still work, but cannot
persist across pages. JavaScript is required for link decoration. Cloud root,
API and other non-authentication paths are outside this policy.

## Cloud analytics handoff

These changes deliver URL parameters to Cloud; they do not configure Cloud's
analytics. Cloud must capture/persist the three `entry_*` fields before login or
redirects remove them and attach them to the registration and cluster-creation
events. Register matching GA4 custom dimensions if they are needed in GA reports.
Preserve campaign fields and click IDs according to Cloud's attribution setup;
forwarding a click ID alone does not prove that GA/Ads attribution is configured.
Historical events cannot be repaired by this change.

## Verification

`npx playwright test tests/cloud-attribution.test.js tests/zh-zilliz-links.test.js tests/zh-doc-home-cta.test.js`

The suite covers root labels, campaign replacement, query whitelisting, blocked
storage, link eligibility, Chinese destinations, dynamic HTML and route changes.
