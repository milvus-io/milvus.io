import {
  AcquisitionParams,
  buildCloudEntryUrl,
  parseCloudEntryUrl,
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
  links: TrackedCloudLinks
): () => void {
  const decorate = (anchor: HTMLAnchorElement) => {
    if (anchor.hasAttribute('download') || anchor.closest('pre, code')) return;
    const current = anchor.getAttribute('href');
    if (!current) return;
    const previous = links.get(anchor);
    const original = previous?.decorated === current ? previous.original : current;
    const currentRel = anchor.getAttribute('rel');
    const currentPolicy = anchor.getAttribute('referrerpolicy');
    if (!parseCloudEntryUrl(original)) {
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
    const decorated = buildCloudEntryUrl(
      original,
      page,
      acquisition,
      anchor.dataset.entryButton
    );
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

  const scan = (element: Element) => {
    if (element instanceof HTMLAnchorElement) decorate(element);
    element.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(decorate);
  };

  // Keep right-click/copy-link behavior correct, including asynchronously loaded HTML.
  scan(root);
  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes' && record.target instanceof HTMLAnchorElement) {
        decorate(record.target);
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
  const onNavigate = (event: Event) => {
    const node = event.target;
    const element = node instanceof Element ? node : (node as Node)?.parentElement;
    const anchor = element?.closest('a[href]');
    if (anchor instanceof HTMLAnchorElement) decorate(anchor);
  };
  root.addEventListener('click', onNavigate, true);
  root.addEventListener('auxclick', onNavigate, true);

  return () => {
    observer.disconnect();
    root.removeEventListener('click', onNavigate, true);
    root.removeEventListener('auxclick', onNavigate, true);
  };
}
