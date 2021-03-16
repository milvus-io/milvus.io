import React from 'react';
import Search from '../../../images/mobileIcon/search.svg';
import './index.scss';

const SearchForMobile = props => {
  const { showMobileMask } = props;

  return (
    <div className="search-wrapper-mobile">
      <a href="/#" onClick={e => showMobileMask(e, { actionType: 'search' })}>
        <img src={Search} alt="search-logo" />
      </a>
    </div>
  );
};

export default SearchForMobile;
