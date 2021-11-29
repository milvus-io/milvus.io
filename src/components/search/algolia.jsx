import React from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

export const AlgoliaSearch = props => {
  const { locale, version } = props;
  return (
    <DocSearch
      appId="KDWQ9FED58"
      apiKey="77c32b25345240c5014c86a62f3c7d80"
      indexName="milvus"
      searchParameters={{
        facetFilters: [
          `language:${locale === 'cn' ? 'zh-cn' : 'en'}`,
          `version:${version}`,
        ],
      }}
    />
  );
};
