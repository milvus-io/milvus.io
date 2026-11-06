import { activateHandoff, analyticsConsent, contentDimensions, pushGrowthEvent } from './growth-measurement';
import {
  ACQUISITION_KEYS,
  AcquisitionParams,
  buildCloudEntryUrl,
  normalizeAttributionPage,
  parseCloudEntryUrl,
  parseZillizEntryUrl,
} from './cloud-attribution';

export type TrackedCloudLinks = WeakMap<
  HTMLAnchorElement,
  {
    original: string;
    decorated: string;
    originalRel: string | null;
    originalPolicy: string | null;
    decoratedRel: string;
  }
>;

// One path for React CTAs and links rendered from documentation HTML alike.
export function trackCloudLinks(
  root: HTMLElement,
  page: string,
  acquisition: AcquisitionParams,
  links: TrackedCloudLinks,
  context: Record<string, string> = {}
): () => void {
  const decorate = (anchor: HTMLAnchorElement) => {
    if (anchor.hasAttribute('download') || anchor.closest('pre, code')) return;
    const current = anchor.getAttribute('href');
    if (!current) return;
    const previous = links.get(anchor);
    const original = previous?.decorated === current ? previous.original : current;
    const currentRel = anchor.getAttribute('rel');
    const currentPolicy = anchor.getAttribute('referrerpolicy');
    const marketing = parseZillizEntryUrl(original);
    if (!parseCloudEntryUrl(original) && !marketing) {
      // A reused anchor may now point outside Cloud. Restore only attributes
      // we still own; do not overwrite new values supplied by React/content.
      if (previous) {
        if (currentRel === previous.decoratedRel) {
          if (previous.originalRel === null) anchor.removeAttribute('rel');
          else anchor.setAttribute('rel', previous.originalRel);
        }
        if (currentPolicy === 'strict-origin-when-cross-origin') {
          if (previous.originalPolicy === null) anchor.removeAttribute('referrerpolicy');
          else anchor.setAttribute('referrerpolicy', previous.originalPolicy);
        }
        links.delete(anchor);
      }
      return;
    }
    let decorated = marketing ? marketing.toString() : buildCloudEntryUrl(
      original,
      page,
      acquisition,
      anchor.dataset.entryButton
    );
    const entry = new URL(decorated);
    if (marketing) {
      if (Object.keys(acquisition).length) ACQUISITION_KEYS.forEach(key => entry.searchParams.delete(key));
      Object.entries(acquisition).forEach(([key, value]) => entry.searchParams.set(key, value));
      entry.searchParams.set('entry_site', 'milvus.io');
      entry.searchParams.set('entry_page', normalizeAttributionPage(page));
      entry.searchParams.set('entry_button', anchor.dataset.entryButton || 'milvus_to_zilliz');
    }
    if (marketing || entry.hostname === 'cloud.zilliz.com') {
      Object.entries(context).forEach(([key, value]) => entry.searchParams.set(key, value));
      entry.searchParams.delete('handoff_id');
      entry.searchParams.delete('handoff_at');
      entry.searchParams.set('analytics_consent', analyticsConsent());
      decorated = entry.toString();
    }
    if (decorated !== current) anchor.setAttribute('href', decorated);

    // Cloud may use the referring origin as a second source signal. Send only
    // the origin across domains, while keeping new tabs isolated from this page.
    const rel = (currentRel || '')
      .split(/\s+/)
      .filter(token => token && token.toLowerCase() !== 'noreferrer');
    if (!rel.some(token => token.toLowerCase() === 'noopener')) rel.push('noopener');
    const value = rel.join(' ');
    links.set(anchor, {
      original,
      decorated,
      originalRel: previous && currentRel === previous.decoratedRel ? previous.originalRel : currentRel,
      originalPolicy: previous && currentPolicy === 'strict-origin-when-cross-origin' ? previous.originalPolicy : currentPolicy,
      decoratedRel: value,
    });
    if (currentRel !== value) anchor.setAttribute('rel', value);
    if (anchor.referrerPolicy !== 'strict-origin-when-cross-origin') {
      anchor.referrerPolicy = 'strict-origin-when-cross-origin';
    }
  };

  const scan = (element: Element, refresh = false) => {
    const visit = (anchor: HTMLAnchorElement) => {
      if (refresh || links.get(anchor)?.decorated !== anchor.getAttribute('href')) decorate(anchor);
    };
    if (element instanceof HTMLAnchorElement) visit(element);
    element.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(visit);
  };

  // Keep right-click/copy-link behavior correct, including asynchronously loaded HTML.
  scan(root, true);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof HTMLAnchorElement) {
        const state = links.get(record.target);
        const ownedWrite = state && (
          (record.attributeName === 'href' && state.decorated === record.target.getAttribute('href')) ||
          (record.attributeName === 'rel' && state.decoratedRel === record.target.getAttribute('rel')) ||
          (record.attributeName === 'referrerpolicy' && record.target.referrerPolicy === 'strict-origin-when-cross-origin')
        );
        if (!ownedWrite) decorate(record.target);
      }
      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  });
  observer.observe(root, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['href', 'data-entry-button', 'rel', 'referrerpolicy'],
  });

  // Catch a dynamically inserted link clicked before its observer callback runs.
  const onNavigate = (event: MouseEvent) => {
    if (event.defaultPrevented || (event.type === 'auxclick' ? event.button !== 1 : event.button !== 0)) return;
    const node = event.target;
    const element = node instanceof Element ? node : (node as Node)?.parentElement;
    const anchor = element?.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    decorate(anchor);
    const cloud = parseCloudEntryUrl(anchor.href);
    if (!cloud) {
      const marketing = parseZillizEntryUrl(anchor.href);
      if (marketing && !anchor.closest('[data-track]')) pushGrowthEvent('cta_link_click', {
        ...contentDimensions('milvus.io', '/' + page.replace(/^homepage$/, '')),
        cta_action: 'zilliz_visit', cta_destination: marketing.origin + marketing.pathname,
        cta_location: anchor.dataset.ctaLocation || (anchor.closest('header') ? 'header' : anchor.closest('footer') ? 'footer' : 'content'),
        entry_button: marketing.searchParams.get('entry_button') || 'milvus_to_zilliz',
        link_url: marketing.origin + marketing.pathname,
      });
      return;
    }
    if (cloud.hostname !== 'cloud.zilliz.com' || !links.has(anchor)) return;
    const activation = activateHandoff(cloud);
    const decorated = cloud.toString();
    links.set(anchor, { ...links.get(anchor)!, decorated });
    anchor.setAttribute('href', decorated);
    const location = anchor.dataset.ctaLocation || (anchor.closest('header') ? 'header' : anchor.closest('footer') ? 'footer' : 'content');
    const signup = cloud.pathname.replace(/\/$/, '') === '/signup';
    pushGrowthEvent(signup ? 'cta_zilliz_signup_click' : 'cta_link_click', {
      ...contentDimensions('milvus.io', '/' + page.replace(/^homepage$/, '')), ...activation,
      cta_location: location, cta_action: signup ? 'cloud_signup' : 'cloud_login',
      cta_destination: cloud.origin + cloud.pathname,
      entry_button: cloud.searchParams.get('entry_button') || `milvus_${location}_cloud`,
      link_url: cloud.origin + cloud.pathname,
    });
  };
  root.addEventListener('click', onNavigate, true);
  root.addEventListener('auxclick', onNavigate, true);

  return () => {
    observer.disconnect();
    root.removeEventListener('click', onNavigate, true);
    root.removeEventListener('auxclick', onNavigate, true);
  };
}
