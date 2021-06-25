import React from 'react';
import * as searchStyles from './index.module.less';
const Search = () => {
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
