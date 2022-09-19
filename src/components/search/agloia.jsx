import React from 'react';
import { DocSearch } from '@docsearch/react';

import * as classes from './agloia.module.less';

export const AlgoliaSearch = props => {
  const { locale, version, trans } = props;
  return (
    <div className={classes.DocSearchWrapper}>
      <DocSearch
        appId="KDWQ9FED58"
        apiKey="77c32b25345240c5014c86a62f3c7d80"
        indexName="milvus"
        className={classes.milvusDocSearch}
        searchParameters={{
          facetFilters: [
            `language:${locale === 'cn' ? 'zh-cn' : 'en'}`,
            `version:${version}`,
          ],
        }}
        placeholder={
          trans ? trans('v3trans.algolia.button.buttonText') : 'search'
        }
        translations={
          trans && trans('v3trans.algolia', { returnObjects: true })
        }
      />
    </div>
  );
};
