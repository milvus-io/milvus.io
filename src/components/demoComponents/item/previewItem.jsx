import React from 'react';
import { useMobileScreen } from '../../../hooks';
import blackSearch from '../../../images/milvus-demos/search-black.svg';
import SearchIcon from './searchIcon';
import * as styles from './preview.module.less';

const PreviewItem = ({ src, distance, handleSearch }) => {
  const { isMobile } = useMobileScreen();

  return (
    <div className={styles.previewContainer}>
      <div className={styles.imgContent}>
        <img src={src} alt="" />
      </div>
      <div className={styles.descSection}>
        <div className={styles.distance}>
          <p>Similarity Metric:</p>
          <p className={styles.text}> {distance}</p>
        </div>

        <div
          className={styles.searchBtnWrapper}
          onClick={() => handleSearch(src)}
        >
          <span className={styles.iconWrapper}>
            <SearchIcon color="#fff" />
          </span>
          {!isMobile ? (
            <h5 className={styles.text}>&nbsp;&nbsp;Search</h5>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PreviewItem;
