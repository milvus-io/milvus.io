export const CLOUD_ACQUISITION_STORAGE_KEY = 'milvus_cloud_acquisition_v1';

// Only attribution fields may cross domains, not arbitrary page query data.
export const ACQUISITION_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_id',
  'utm_term',
  'utm_content',
  'utm_source_platform',
  'utm_creative_format',
  'utm_marketing_tactic',
  'gclid',
  'dclid',
  'gbraid',
  'wbraid',
  'msclkid',
  'fbclid',
  'ttclid',
  'bd_vid',
  'gad_source',
  'gad_campaignid',
  'rdt_cid',
  'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
] as const;

export type AcquisitionParams = Partial<
  Record<(typeof ACQUISITION_KEYS)[number], string>
>;

type AttributionStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function getMilvusEntryPage(asPath: string): string {
  const route = asPath.split(/[?#]/)[0];
  return !route || route === '/' ? 'homepage' : route.replace(/^\//, '');
}

export function getAcquisitionParams(
  asPath: string,
  storage?: AttributionStorage
): AcquisitionParams {
  const search = asPath.split('#')[0].split('?')[1] || '';
  const query = new URLSearchParams(search);
  const current: AcquisitionParams = {};
  for (const key of ACQUISITION_KEYS) {
    const value = query.get(key);
    if (value && value.length <= 500 && !/[\r\n]/.test(value)) current[key] = value;
  }

  if (Object.keys(current).length) {
    // A new tagged arrival replaces the previous campaign as a whole.
    try {
      storage?.setItem(CLOUD_ACQUISITION_STORAGE_KEY, JSON.stringify(current));
    } catch {
      // Current URL attribution still works when storage is unavailable.
    }
    return current;
  }

  try {
    const saved = JSON.parse(
      storage?.getItem(CLOUD_ACQUISITION_STORAGE_KEY) || '{}'
    );
    const cached: AcquisitionParams = {};
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return cached;
    for (const key of ACQUISITION_KEYS) {
      if (typeof saved[key] === 'string' && saved[key] && saved[key].length <= 500 && !/[\r\n]/.test(saved[key])) cached[key] = saved[key];
    }
    return cached;
  } catch {
    return {};
  }
}

export function parseCloudEntryUrl(href: string): URL | undefined {
  if (!/^(?:https:)?\/\//i.test(href)) return;

  let url: URL;
  try {
    url = new URL(href, 'https://milvus.io');
  } catch {
    return;
  }
  if (
    !['cloud.zilliz.com', 'cloud.zilliz.com.cn'].includes(url.hostname) ||
    url.username ||
    url.password ||
    url.port ||
    !['/signup', '/signin', '/login'].includes(url.pathname.replace(/\/$/, ''))
  ) {
    return;
  }
  return url;
}

export function parseZillizEntryUrl(href: string): URL | undefined {
  if (!/^(?:https:)?\/\//i.test(href)) return;
  try {
    const url = new URL(href, 'https://milvus.io');
    if (['zilliz.com', 'www.zilliz.com'].includes(url.hostname) && !url.username && !url.password && !url.port && /^\/(cloud|pricing|contact-sales)?\/?$/.test(url.pathname)) return url;
  } catch {}
}

export function buildCloudEntryUrl(
  href: string,
  page: string,
  acquisition: AcquisitionParams,
  button?: string
): string {
  const url = parseCloudEntryUrl(href);
  if (!url) return href;

  // Read the old Milvus campaign (button position) before replacing its UTMs.
  const entryButton =
    button ||
    url.searchParams.get('entry_button') ||
    (url.searchParams.get('utm_source') === 'milvusio'
      ? url.searchParams.get('utm_campaign')
      : '') ||
    (url.pathname.startsWith('/signup') ? 'cloud_signup' : 'cloud_signin');

  const incoming = ACQUISITION_KEYS.filter(key => acquisition[key]);
  if (incoming.length) {
    // Do not mix a real acquisition campaign with hard-coded Milvus referral UTMs.
    // Click-ID-only arrivals also remove those UTMs, leaving auto-tagging intact.
    for (const key of ACQUISITION_KEYS) url.searchParams.delete(key);
    for (const key of incoming) url.searchParams.set(key, acquisition[key]!);
  }

  url.searchParams.set('entry_site', 'milvus.io');
  url.searchParams.set('entry_page', page);
  url.searchParams.set('entry_button', entryButton);
  return url.toString();
}
