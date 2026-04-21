import { useEffect, useRef, useState } from 'react';

type Options = {
  /** ms to show the "copied" state before reverting. */
  ttl?: number;
};

/**
 * Copy text to the clipboard with a short-lived visual-feedback state
 * (for "Copied!" affordances). Handles:
 *   - async Clipboard API (https / localhost secure contexts)
 *   - legacy execCommand('copy') fallback (plain-IP dev servers,
 *     older browsers)
 *   - timer cleanup on unmount AND on re-invocation (so rapid
 *     double-clicks reset the timer instead of stacking it)
 */
export function useCopyFeedback({ ttl = 1500 }: Options = {}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copy = async (text: string): Promise<boolean> => {
    let ok = false;

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        ok = true;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[home2] clipboard.writeText failed, falling back', err);
    }

    if (!ok) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[home2] execCommand copy fallback failed', err);
      }
    }

    if (ok) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setCopied(true);
      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, ttl);
    }

    return ok;
  };

  return { copied, copy };
}
