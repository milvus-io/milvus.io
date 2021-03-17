import React from 'react';
import './index.scss';

const SearchForMobile = props => {
  const { showMobileMask } = props;

  return (
    <div className="search-wrapper-mobile">
      <i
        role="button"
        tabIndex={0}
        className="fas fa-search font-icon"
        aria-label="search-button"
        onClick={() => showMobileMask({ actionType: 'search' })}
        onKeyDown={() => showMobileMask({ actionType: 'search' })}
      ></i>
    </div>
  );
};

export default SearchForMobile;
