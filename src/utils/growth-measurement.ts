export type AnalyticsConsent = 'granted' | 'denied' | 'unknown';

// Read the CMP at activation time, including revocations since page load.
export function analyticsConsent(): AnalyticsConsent {
  if (typeof window === 'undefined') return 'unknown';
  try {
    const value = document.cookie.match(/(?:^|;\s*)CookieConsent=([^;]*)/)?.[1];
    if (value === 'true') return 'granted';
    if (value === 'false') return 'denied';
  } catch {}
  return 'unknown';
}

export function activateHandoff(url: URL): { analytics_consent: AnalyticsConsent; handoff_id: string } {
  const consent = analyticsConsent();
  // Never reuse an ID from an old href or a pasted URL on a new activation.
  url.searchParams.delete('handoff_id');
  url.searchParams.set('analytics_consent', consent);
  url.searchParams.set('handoff_at', new Date().toISOString());
  const id = consent === 'granted' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : '';
  if (id) url.searchParams.set('handoff_id', id);
  return { analytics_consent: consent, handoff_id: id };
}

export function contentDimensions(site: string, path: string): Record<string, string> {
  let page = path.split(/[?#]/)[0] || '/';
  // Only same-site canonicals are allowed; queries never become content labels.
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  try {
    const url = new URL(canonical || '', `https://${site}`);
    if (canonical && [site, `www.${site}`].includes(url.hostname)) page = url.pathname;
  } catch {}
  const content = document.querySelector<HTMLElement>('[data-content-id]');
  const segments = page.split('/').filter(Boolean);
  const language = document.querySelector('main[lang]')?.getAttribute('lang') || document.documentElement.lang || 'en';
  const group = segments[0] === 'zh' ? segments[1] : segments[0];
  return {
    site, content_id: content?.dataset.contentId || `${site}${page}`,
    content_type: content?.dataset.contentType || group || 'home',
    content_topic: content?.dataset.contentTopic || group || 'home',
    content_language: language,
    content_revision: content?.dataset.contentRevision || 'unknown',
    landing_page: page, landing_topic: content?.dataset.contentTopic || group || 'home',
  };
}

export function pushGrowthEvent(event: string, dimensions: Record<string, string>): void {
  // Reset optional fields so GTM's persistent data model cannot reuse an earlier
  // visitor's granted handoff or an enhanced-conversion email on this event.
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  (w.dataLayer = w.dataLayer || []).push({ event, user_data: null, handoff_id: '',
    cta_action: '', cta_destination: '', cta_location: '', entry_button: '', link_url: '', form_id: '', error_type: '',
    analytics_consent: analyticsConsent(), ...dimensions });
}
