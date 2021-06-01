import React, { useState } from 'react';
import * as searchStyles from './index.module.less';

const Search = ({ handleSearch }) => {
  const [keyWord, setKeyWord] = useState('');
  const search = () => {
    handleSearch(keyWord);
  };
  const handleChange = e => {
    setKeyWord(e.target.value);
  };
  return (
    <div className={searchStyles.searchSection}>
      <div className={searchStyles.inputWrapper}>
        <input
          type="text"
          placeholder="Search"
          className={searchStyles.input}
          value={keyWord}
          onChange={handleChange}
        />
        <span
          className={searchStyles.iconWrapper}
          role="button"
          tabIndex={-1}
          onClick={search}
          onKeyDown={search}
        >
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );
};

export default Search;
