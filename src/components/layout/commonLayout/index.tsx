import React from 'react';
import Header from '../../header';
import Footer from '../../footer';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { useGlobalLocale } from '@/hooks/use-global-locale';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Layout: React.FC<{
  darkMode?: boolean;
  children: React.ReactNode;
  showFooter?: boolean;
  headerClassName?: string;
  disableLangSelector?: boolean;
}> = ({
  darkMode,
  children,
  showFooter = true,
  headerClassName = '',
  disableLangSelector = false,
}) => {
  const { locale } = useGlobalLocale();
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <link
          rel="alternate"
          hrefLang={locale}
          href={`${ABSOLUTE_BASE_URL}${asPath}`}
        />
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
