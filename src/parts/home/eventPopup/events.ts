import { LanguageEnum } from '@/types/localization';

export interface EventPopupConfig {
  /** Registration page the cover links to. */
  link: string;
  /** Served straight from the CDN — already compressed, no next/image. */
  coverImage: string;
  coverWidth: number;
  coverHeight: number;
  coverAlt: string;
  /** Accessible label for the close button, in the page's language. */
  closeLabel: string;
  /**
   * Epoch ms after which the popup stops showing on its own, so nobody has to
   * ship a follow-up release to take it down.
   */
  endTime: number;
  /**
   * sessionStorage key written on close. Bumping it would re-show the popup to
   * visitors who already dismissed it.
   */
  dismissedKey: string;
}

/**
 * One-off promo popups shown on the homepage, keyed by page locale. Once an
 * event is over its entry can simply be deleted; when the map is empty the
 * whole folder (and its usage in pages/index.tsx and pages/[lang]/index.tsx)
 * can go.
 */
export const HOME_EVENT_POPUPS: Partial<
  Record<LanguageEnum, EventPopupConfig>
> = {
  // Milvus Meetup Paris, 2026/10/07 18:00-22:00 CEST.
  [LanguageEnum.ENGLISH]: {
    link: 'https://luma.com/bfo1andh',
    coverImage: 'https://assets.zilliz.com/paris_meetup_e34c34bc07.png',
    coverWidth: 1920,
    coverHeight: 1080,
    coverAlt:
      'Milvus Meetup Paris — The Hard Parts of Vector Search: Scaling Retrieval in Production, Oct 7, 2026',
    closeLabel: 'Close',
    endTime: new Date('2026-10-07T22:00:00+02:00').getTime(),
    dismissedKey: 'home-event-popup-paris-meetup-2026',
  },
};
