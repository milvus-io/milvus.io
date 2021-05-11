import React, { useState } from 'react';
import * as searchStyles from './search.module.less';

const Search = ({ handleSearch }) => {
  const [focus, setFocus] = useState(false);
  const [keyWord, setKeyWord] = useState('');

  const handleFocus = () => {
    setFocus(true);
  };
  const search = () => {
    handleSearch(keyWord);
  };
  const handleChange = e => {
    setKeyWord(e.target.value);
  };
  return (
    <div className={searchStyles.searchSection}>
      <div
        className={`${searchStyles.inputWrapper} ${
          focus ? searchStyles.focus : ''
        }`}
      >
        <input
          type="text"
          placeholder="Search"
          className={searchStyles.input}
          onFocus={handleFocus}
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
