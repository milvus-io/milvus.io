import React from 'react';
import * as styles from './index.module.less';

const SearchForMobile = props => {
  const { showMobileMask } = props;

  return (
    <div className={styles.searchWrapperMobile}>
      <i
        role="button"
        tabIndex={0}
        className={`fas fa-search ${styles.fontIcon}`}
        aria-label="search-button"
        onClick={() => showMobileMask({ actionType: 'search' })}
        onKeyDown={() => showMobileMask({ actionType: 'search' })}
      ></i>
    </div>
  );
};

export default SearchForMobile;
