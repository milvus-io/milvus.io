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
    </Head>
  );
};
