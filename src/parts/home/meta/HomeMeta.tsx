import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { ABSOLUTE_BASE_URL } from '@/consts';
import { LanguageEnum } from '@/types/localization';

type Props = {
  locale: LanguageEnum;
};

export const HomeMeta = (props: Props) => {
  const { locale } = props;
  const { t } = useTranslation('home', { lng: locale });

  return (
    <Head>
      <title>{t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
    </Head>
  );
};
