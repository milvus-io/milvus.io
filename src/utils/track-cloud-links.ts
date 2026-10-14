import { AcquisitionParams, buildCloudEntryUrl } from './cloud-attribution';

export type TrackedCloudLinks = WeakMap<
  HTMLAnchorElement,
  { original: string; decorated: string }
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
    const decorated = buildCloudEntryUrl(
      original,
      page,
      acquisition,
      anchor.dataset.entryButton
    );
    links.set(anchor, { original, decorated });
    if (decorated !== current) anchor.setAttribute('href', decorated);
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
    attributeFilter: ['href', 'data-entry-button'],
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
