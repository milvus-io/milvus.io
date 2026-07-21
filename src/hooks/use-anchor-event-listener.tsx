import { useEffect } from 'react';

import { checkIconTpl, linkIconTpl } from '@/components/icons';
import { copyToCommand } from '@/utils/common';

/**
 * Binds the "copy heading link" behaviour for the `.anchor-icon` buttons that
 * the rehype anchor plugin injects after h1/h2/h3.
 *
 * Uses a single delegated listener on `document` instead of attaching a
 * listener to every button. The buttons live inside a `dangerouslySetInnerHTML`
 * block, so their DOM nodes are recreated whenever the article content changes
 * (client-side navigation, version switch that keeps the same doc id, or a
 * hydration-mismatch regeneration). Per-node listeners are lost on those
 * recreations and are not re-bound, which made the button "dead" until a full
 * page refresh. Delegating on `document` — a node that always persists —
 * survives every recreation, so nothing ever needs re-binding.
 */
export const useAnchorEventListener = () => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest<HTMLElement>(
        '.anchor-icon'
      );
      if (!anchor) {
        return;
      }

      // Compute the base href at click time so the copied link always points
      // at the current page, even after client-side navigation.
      const baseHref = window.location.href.split('#')[0];
      const href = anchor.dataset.href ?? '';
      copyToCommand(`${baseHref}${href}`);

      anchor.innerHTML = checkIconTpl;
      window.setTimeout(() => {
        anchor.innerHTML = linkIconTpl;
      }, 3000);
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
