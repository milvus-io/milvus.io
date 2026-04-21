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
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
};
