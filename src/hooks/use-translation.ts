import { useTranslation } from 'react-i18next';
import { useGlobalLocale } from '@/hooks/use-global-locale';

export const useTrans: typeof useTranslation = (params, options) => {
  const { locale } = useGlobalLocale();
  const res = useTrans(params, { ...options, lng: locale });
  return res;
};
