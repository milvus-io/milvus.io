import React from 'react';
import Header from '../../header';
import Footer from '../../footer';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { isIndexableLanguage } from '@/types/localization';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Layout: React.FC<{
  darkMode?: boolean;
  children: React.ReactNode;
  showFooter?: boolean;
  headerClassName?: string;
  disableLangSelector?: boolean;
  // Override the canonical URL. When set, the page is canonicalized to this
  // URL instead of self. Pages that render their own canonical (e.g. blog
  // detail, which canonicalizes localized posts to the English original) MUST
  // pass it here rather than emitting a second <link rel="canonical">, or the
  // two conflicting tags make Google drop both ("Duplicate without
  // user-selected canonical"). Defaults to self for all other pages.
  canonicalUrl?: string;
  // Suppress the default self-referential hreflang. Pages that emit their own
  // complete hreflang cluster (e.g. blog detail) set this so the cluster isn't
  // duplicated or polluted with a non-indexable self-reference.
  disableSelfHreflang?: boolean;
}> = ({
  darkMode,
  children,
  showFooter = true,
  headerClassName,
  disableLangSelector = false,
  canonicalUrl,
  disableSelfHreflang = false,
}) => {
  const { locale } = useGlobalLocale();
  const { asPath } = useRouter();
  // Strip query strings for canonical and hreflang to avoid
  // duplicate-content issues from tracking params (__hstc, utm_*, etc.)
  const cleanPath = asPath.split('?')[0];
  const selfUrl = `${ABSOLUTE_BASE_URL}${cleanPath}`;
  return (
    <>
      <Head>
        <link rel="canonical" href={canonicalUrl ?? selfUrl} />
        {/* Self-referential hreflang, only for indexable languages so we don't
            advertise pages that are consolidated to English. Pages owning their
            full cluster opt out via disableSelfHreflang. */}
        {!disableSelfHreflang && isIndexableLanguage(locale) && (
          <link rel="alternate" hrefLang={locale} href={selfUrl} />
        )}
      </Head>
      <Header
        darkMode={darkMode}
        className={headerClassName}
        disableLangSelector={disableLangSelector}
      />
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
