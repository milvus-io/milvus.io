import { useEffect } from 'react';

export default function useAlgolia(locale, version, condition = true) {
  useEffect(() => {
    if (!condition || !version) return;
    // if not setTimeout, will throw render error
    setTimeout(() => {
      window.docsearch({
        // Your apiKey and indexName will be given to you once
        // we create your config
        apiKey: '2dabff78331a44e47bedeb5fbd68ae70',
        indexName: 'milvus',
        //appId: '<APP_ID>', // Should be only included if you are running DocSearch on your own.
        // Replace inputSelector with a CSS selector
        // matching your search input
        inputSelector: '#algolia-search',
        // Set debug to true to inspect the dropdown
        debug: false,
        algoliaOptions: {
          facetFilters: [
            `language:${locale === 'cn' ? 'zh-cn' : locale}`,
            `version:${version}`,
          ],
        },
      });
    }, 100);
  }, [locale, version, condition]);
}
