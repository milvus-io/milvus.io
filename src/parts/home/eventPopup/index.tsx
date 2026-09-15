import { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { LanguageEnum } from '@/types/localization';
import { HOME_EVENT_POPUPS, type EventPopupConfig } from './events';
import classes from './index.module.css';

/**
 * Promo popup for a one-off event: shows the event cover, clicking it opens
 * the registration page. Which event (if any) is shown depends on the page
 * locale — see ./events.ts.
 */
export default function HomeEventPopup({ locale }: { locale: LanguageEnum }) {
  const config = HOME_EVENT_POPUPS[locale];
  if (!config) {
    return null;
  }
  // Keyed so switching locale on the client remounts with fresh state.
  return <EventPopup key={config.dismissedKey} config={config} />;
}

function EventPopup({ config }: { config: EventPopupConfig }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(config.dismissedKey, '1');
    } catch {
      // Storage can be unavailable (Safari private mode, blocked cookies) —
      // closing still works, the popup just comes back on the next page load.
    }
  }, [config.dismissedKey]);

  // Decide on the client only: the homepage is statically generated, so the
  // date check and the sessionStorage read can't run during the build.
  useEffect(() => {
    if (Date.now() > config.endTime) {
      return;
    }
    try {
      if (window.sessionStorage.getItem(config.dismissedKey)) {
        return;
      }
    } catch {
      // Ignore and show the popup anyway.
    }
    setOpen(true);
  }, [config.endTime, config.dismissedKey]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, close]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={classes.overlay}
      onClick={close}
      role="presentation"
      data-testid="home-event-popup"
    >
      <div
        className={classes.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={config.coverAlt}
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          className={classes.closeBtn}
          onClick={close}
          aria-label={config.closeLabel}
        >
          <X size={18} />
        </button>
        <a
          className={classes.coverLink}
          href={config.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <img
            src={config.coverImage}
            alt={config.coverAlt}
            width={config.coverWidth}
            height={config.coverHeight}
            className={classes.cover}
          />
        </a>
      </div>
    </div>
  );
}
