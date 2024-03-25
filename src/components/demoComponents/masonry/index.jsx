import React, { useMemo } from 'react';
import { Masonry } from 'gestalt';
import * as styles from './index.module.less';
import Item from '../item/item';
import 'gestalt/dist/gestalt.css';
import { useWindowSize } from '../../../http/hooks';

function Main({
  pins,
  loadItems,
  loading,
  isSelected,
  isShowCode,
  handleSearch,
  setModal,
  scrollContainer,
}) {
  const currentSize = useWindowSize();
  const isMobile = ['phone', 'tablet', 'desktop1024'].includes(currentSize);

  return useMemo(
    () => (
      <div
        className={`${styles.scrollContainer} ${
          isShowCode ? styles.openCode : ''
        }`}
      >
        <div className={`${styles.toopTip} ${isSelected ? styles.open : ''}`}>
          <p>Sorted by Similarity metric</p>
          <span className={styles.iconWrapper}>
            <i className="fas fa-exclamation-circle"></i>
          </span>
        </div>
        <div className={`${styles.imgContainer} ${isShowCode ? '' : ''}`}>
          {pins.length ? (
            <Masonry
              items={pins}
              renderItem={data => (
                <Item
                  data={data.data}
                  isSelected={isSelected}
                  handleSearch={handleSearch}
                  setModal={setModal}
                />
              )}
              gutterWidth={16}
              layout="flexible"
              loadItems={loadItems}
              scrollContainer={() => scrollContainer.current}
              virtualize
            />
          ) : null}
        </div>
        {loading ? <div className="loading-wrapper">loading...</div> : null}
      </div>
    ),
    [
      pins,
      loadItems,
      loading,
      isSelected,
      isShowCode,
      handleSearch,
      setModal,
      scrollContainer,
    ]
  );
}

export default Main;
