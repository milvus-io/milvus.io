import React, { useEffect } from 'react';
import * as searchStyles from './index.module.less';

const Search = () => {
  useEffect(() => {
    const algoliaInputWrapper = document.querySelector('.algolia-autocomplete');
    const algoliaMenu = document.querySelector('.ds-dropdown-menu');
    if (algoliaInputWrapper !== null) {
      algoliaInputWrapper.style.width = '100%';
    }
    if (algoliaMenu !== null) {
      algoliaMenu.style.minWidth = '100%';
      algoliaMenu.style.top = '160%';
    }
  });

  return (
    <div className={searchStyles.searchSection}>
      <div className={searchStyles.inputWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={searchStyles.input}
          id="algolia-search"
        />
      </div>
    </div>
  );
};

export default Search;
