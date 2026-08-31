import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Resolves heading anchors whose hash does not match any id on the page.
 *
 * A doc heading can carry a version badge, written in markdown as
 * `## Upsert entities in merge mode | Milvus v2.6.2+`. The `| <badge>` part is
 * only a marker — it renders as a separate `<span class="beta-tag">` — but the
 * id generator used to build the id from the whole raw heading line, so the
 * heading ended up as `Upsert-entities-in-merge-mode--Milvus-v262+` (the `|` is
 * dropped as a special char, the spaces around it survive as `--`). Doc authors
 * naturally link to `#Upsert-entities-in-merge-mode`, which matches nothing, so
 * the link and any shared deep link silently do nothing.
 *
 * The generator is fixed upstream, but that only reaches content the docs
 * pipeline regenerates, and it inverts the problem for links already in the
 * wild that use the badge-suffixed id. So this resolves both directions:
 *
 *   - `#Foo`                 -> heading `Foo--Milvus-v262+`  (content not yet regenerated)
 *   - `#Foo--Milvus-v262+`   -> heading `Foo`                (link predates the fix)
 *
 * Runs only when the hash matches nothing, so a working anchor is never touched
 * and the browser's own scrolling stays in charge of it.
 */

const HEADING_SELECTOR = 'h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]';

// The `|` separator is stripped by the id generator but the spaces around it
// are not, so a badge always shows up in the id as this exact seam.
const BADGE_SEAM = '--';

const readHash = () => {
  const raw = window.location.hash.slice(1);
  if (!raw) {
    return '';
  }
  // Ids may legitimately contain characters the browser percent-encodes (`+`,
  // CJK, …), so compare against the decoded form.
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const findFallbackHeading = (container: HTMLElement, hash: string) => {
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>(HEADING_SELECTOR)
  );

  // Link omits the badge: take the first heading in document order whose id is
  // the hash plus a badge, which is the one a reader scrolling down would hit.
  const badgeAdded = headings.find(heading =>
    heading.id.startsWith(`${hash}${BADGE_SEAM}`)
  );
  if (badgeAdded) {
    return badgeAdded;
  }

  // Link carries the badge but the heading no longer does. Several headings can
  // be a prefix of the hash (`Foo` and `Foo--Bar` both prefix
  // `Foo--Bar--Milvus-v262+`), so the longest id is the closest match.
  return headings
    .filter(heading => hash.startsWith(`${heading.id}${BADGE_SEAM}`))
    .sort((a, b) => b.id.length - a.id.length)[0];
};

export const useHeadingAnchorFallback = (
  articleContainer: React.MutableRefObject<HTMLElement | null>
) => {
  const { asPath } = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const resolveHash = () => {
      const container = articleContainer.current;
      if (!container) {
        return;
      }

      const hash = readHash();
      // `getElementById` rather than `querySelector`: ids such as
      // `Foo--Milvus-v262+` are not valid CSS selectors.
      if (!hash || document.getElementById(hash)) {
        return;
      }

      const heading = findFallbackHeading(container, hash);
      if (!heading) {
        return;
      }

      // `html:has(.scroll-padding) { scroll-padding-top }` keeps this clear of
      // the sticky header, the same way a native anchor jump is kept clear.
      heading.scrollIntoView();

      // Normalise the address bar so the link the reader copies from here works
      // on its own. `search` is preserved because the code-tab filter keeps its
      // state there. replaceState does not fire `hashchange`, so this cannot
      // re-enter.
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#${heading.id}`
      );
    };

    resolveHash();
    window.addEventListener('hashchange', resolveHash);
    return () => {
      window.removeEventListener('hashchange', resolveHash);
    };
  }, [articleContainer, asPath]);
};
