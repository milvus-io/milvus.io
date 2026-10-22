// Session-scoped observations; these are not a lifetime first-touch claim.
export const CONTEXT_KEY = 'growth_entry_context_v1';
export const CONTEXT_FIELDS = [
  'attribution_version', 'first_touch_scope', 'first_entry_site',
  'first_landing_page', 'first_referrer_host', 'first_touch_at',
  'session_entry_page', 'session_started_at',
] as const;
type Context = Partial<Record<(typeof CONTEXT_FIELDS)[number], string>>;
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
  }
  if (field === 'first_entry_site' && !['milvus.io', 'zilliz.com', 'cloud.zilliz.com'].includes(text)) return;
  if (field === 'first_referrer_host' && text && !/^[a-z0-9.-]+$/i.test(text)) return;
  return text;
}

export function getAcquisitionContext(site: string, path: string, referrer: string, store?: Store): Context {
  let saved: Context = {};
  try { saved = JSON.parse(store?.getItem(CONTEXT_KEY) || '{}') || {}; } catch {}
  const current = new URLSearchParams(path.split('#')[0].split('?')[1] || '');
  const incoming: Context = {};
  for (const field of CONTEXT_FIELDS) {
    const value = clean(field, current.get(field));
    if (value !== undefined) incoming[field] = value;
  }
  const existing = incoming.first_touch_at ? incoming : saved;
  let referrerHost = '';
  try { referrerHost = new URL(referrer).hostname; } catch {}
  const now = new Date().toISOString();
  const result: Context = {
    attribution_version: '1', first_touch_scope: 'browser_session',
    first_entry_site: site, first_landing_page: path.split(/[?#]/)[0] || '/',
    first_referrer_host: referrerHost, first_touch_at: now,
    session_entry_page: path.split(/[?#]/)[0] || '/', session_started_at: now,
  };
  // Never spread arbitrary cached/query properties into a URL or analytics.
  for (const field of CONTEXT_FIELDS) {
    const value = clean(field, existing[field]);
    if (value !== undefined) result[field] = value;
  }
  result.attribution_version = '1';
  result.first_touch_scope = 'browser_session';
  try { store?.setItem(CONTEXT_KEY, JSON.stringify(result)); } catch {}
  return result;
}
