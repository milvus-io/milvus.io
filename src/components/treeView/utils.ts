import { LanguageEnum } from '@/components/language-selector';

export const getLinkPrefix = (params: {
  type: 'doc' | 'api';
  lang?: LanguageEnum;
  category?: string;
}) => {
  const { type, category, lang } = params;
  if (type === 'doc') {
    if (!lang || lang === LanguageEnum.ENGLISH) {
      return '/docs';
    }
    return `/docs/${lang}`;
  }
  return `/api-reference/${category}`;
};
