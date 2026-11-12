import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/use-store';

// The server's shared i18n instance can still be English while rendering a
// localized route. Use the route/store locale for matching SSR and hydration.
export const useSizingTranslation = () => {
  const { state: { locale } } = useStore();
  return useTranslation('sizingTool', { lng: locale });
};
