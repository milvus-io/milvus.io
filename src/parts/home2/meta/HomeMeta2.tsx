import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '@/types/localization';

type Props = {
  locale: LanguageEnum;
};

export const HomeMeta2 = (props: Props) => {
  const { locale } = props;
  const { t } = useTranslation('home2', { lng: locale });

  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      {/* Geist + Geist Mono. The site nav already loads Geist, but home2
          may render before that depending on bundle order; re-declare so
          home2 never falls back to system sans. */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};
