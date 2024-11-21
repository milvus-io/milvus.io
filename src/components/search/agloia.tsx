import { DocSearch } from '@docsearch/react';
import classes from './agloia.module.less';
import { useTranslation } from 'react-i18next';
import { LanguageEnum } from '../language-selector/LanguageSelector';
import { useEffect } from 'react';

export const AlgoliaSearch = (props: {
  locale?: LanguageEnum;
  version: string;
}) => {
  const { locale = 'en', version } = props;
  const { t } = useTranslation('common', { lng: locale });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '/') {
        event.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={classes.DocSearchWrapper}>
      <DocSearch
        appId="KDWQ9FED58"
        apiKey="77c32b25345240c5014c86a62f3c7d80"
        indexName="milvus"
        searchParameters={{
          facetFilters: [`language:${locale}`, `version:${version}`],
        }}
        placeholder={t('v3trans.algolia.button.buttonText')}
        translations={t('v3trans.algolia', { returnObjects: true })}
      />
    </div>
  );
};
