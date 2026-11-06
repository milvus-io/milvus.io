import { ACQUISITION_KEYS, normalizeAttributionPage } from './cloud-attribution';
// Retain the v1 key so an older first observation is never relabelled as v2.
export const CONTEXT_KEY = 'growth_entry_context_v1';
export const CONTEXT_ACQUISITION_KEYS = [
  'attribution_version', 'first_touch_scope', 'first_touch_version', 'first_entry_site',
  'first_landing_page', 'first_referrer_host', 'first_touch_at',
  'session_entry_page', 'session_started_at',
  ...ACQUISITION_KEYS.map(field => `first_${field}`),
] as const;
type Context = Record<string, string>;
type Store = Pick<Storage, 'getItem' | 'setItem'>;
function clean(field: string, value: unknown): string | undefined {
  if (typeof value !== 'string' || value.length > 500 || /[\r\n]/.test(value)) return;
  let text = value;
  if (field.endsWith('_at')) {
    const time = Date.parse(value);
    if (!Number.isFinite(time) || time < Date.UTC(2000, 0, 1) || time > Date.now() + 300000) return;
  }
  if (field.endsWith('_page')) {
    text = text.split(/[?#]/)[0];
    if (!text.startsWith('/') || text.startsWith('//') || /[@\\]/.test(text)) return;
    text = normalizeAttributionPage(text);
  }
  if (field === 'first_entry_site' && !['milvus.io', 'zilliz.com', 'cloud.zilliz.com'].includes(text)) return;
  if (field === 'first_referrer_host' && text && !/^[a-z0-9.-]+$/i.test(text)) return;
  if (field === 'first_touch_version' && text !== '2') return;
  return text;
}
function pick(value: unknown): Context {
  const result: Context = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  for (const field of CONTEXT_ACQUISITION_KEYS) {
    const text = clean(field, (value as Context)[field]);
    if (text !== undefined) result[field] = text;
  }
  return result;
}
export function getAcquisitionContext(site: string, path: string, referrer: string, store?: Store): Context {
  let saved: Context = {};
  try { saved = pick(JSON.parse(store?.getItem(CONTEXT_KEY) || '{}')); } catch {}
  const current = new URLSearchParams(path.split('#')[0].split('?')[1] || '');
  const incoming = pick(Object.fromEntries(current));
  const existing = incoming.first_touch_at ? incoming : saved;
  const now = new Date().toISOString();
  const page = normalizeAttributionPage(path.split(/[?#]/)[0] || '/');
  const result: Context = { attribution_version: '2', first_touch_scope: 'browser_session',
    session_entry_page: saved.session_entry_page || page,
    session_started_at: saved.session_started_at || now };
  if (existing.first_touch_at) {
    // Copy a first bundle as a unit. A legacy bundle is never enriched from the
    // current URL/cached campaign and never receives a v2 completeness marker.
    for (const [key, value] of Object.entries(existing)) {
      if (key.startsWith('first_')) result[key] = value;
    }
    if (existing.first_touch_version !== '2') {
      ACQUISITION_KEYS.forEach(field => delete result[`first_${field}`]);
    }
  } else {
    let host = '';
    try { host = new URL(referrer).hostname; } catch {}
    Object.assign(result, { first_touch_version: '2', first_entry_site: site,
      first_landing_page: page, first_referrer_host: host, first_touch_at: now });
    ACQUISITION_KEYS.forEach(field => {
      const value = clean(field, current.get(field));
      if (value) result[`first_${field}`] = value;
    });
  }
  result.first_touch_scope = 'browser_session';
  try { store?.setItem(CONTEXT_KEY, JSON.stringify(result)); } catch {}
  return result;
}
