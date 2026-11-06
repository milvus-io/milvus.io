# Global growth attribution repair

This change records session-scoped first observed content and the immediate
website/CTA handoff separately from acquisition campaign fields. It does not
claim lifetime first touch or turn a CTA click into a completed signup/ICP.

- Milvus links to Global Cloud and selected Zilliz entry pages carry bounded,
  allowlisted context. Original campaign groups are replaced together when a new
  tagged visit arrives; query values outside the campaign list are never copied.
- Session storage failures do not block navigation. Query/fragment values are
  excluded from content paths and event link paths.
- Existing landing `data-track` events retain their position-specific names;
  the site-wide handler skips them to prevent duplicate CTA emissions.
- Newsletter success occurs only after a successful HubSpot API response. No
  email is included in its success/failure GA4 payload.
- GTM loads after hydration on the production hostname. Its existing consent
  initialization remains responsible for consent; preview/local hosts do not load
  the production container.

## Verification and release

Run `node --test tests/acquisition-context.test.cjs`,
`npx playwright test tests/cloud-attribution.test.js --workers=1` and
`npx tsc --noEmit`.

Milvus GTM v23 already forwards CTA events, but the new newsletter success/failure
names require a separately verified GTM forwarder before reporting those events.
Code tests do not establish GA4 ingestion or CRM persistence. Deploy the Cloud
allowlist/redirect fix with the website change, then reconcile real internal IDs
against the Global CRM/warehouse feed. Never submit fake production leads to test.

Rollback this source change independently; no existing conversion goal or CRM
record is edited. Reverting the associated GTM update must preserve consent tags.
