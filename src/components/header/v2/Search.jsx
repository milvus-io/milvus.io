import React, { useState } from 'react';

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
    <div className="search-section">
      <div className={`input-wrapper ${focus ? 'focus' : ''}`}>
        <input
          type="text"
          placeholder='Search'
          className='input'
          onFocus={handleFocus}
          value={keyWord}
          onChange={e => handleChange(e)}
        />
        <span className="icon-wrapper" role='button' tabIndex={-1} onClick={search} onKeyDown={search}>
          <i className="fas fa-search"></i>
        </span>
      </div>
    </div>
  );

};

export default Search;