import React from 'react';
import PreviewItem from './previewItem';
import * as styles from './item.module.less';

const Item = props => {
  const {
    data: { height, width, src, distance, origin_src },
    isSelected,
    onSearch,
    setModal,
  } = props;

  const closeCustomDialog = () => {
    setModal({
      open: false,
    });
  };

  const handlePreview = () => {
    setModal({
      open: true,
      component: () => (
        <PreviewItem
          src={origin_src}
          distance={distance}
          closeCustomDialog={closeCustomDialog}
          handleSearch={() => {
            onSearch(src);
            closeCustomDialog();
          }}
        />
      ),
      handleCloseModal: closeCustomDialog,
    });
  };

  const searchThisPic = (e, src) => {
    e.stopPropagation();
    onSearch(src);
  };

  return (
    <div
      className="relative w-full p-0 block items-center ui-item "
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <div
        className={styles.imgWrapper}
        onClick={handlePreview}
        onKeyDown={handlePreview}
        draggable="true"
        role="button"
        tabIndex="-1"
      >
        <img
          alt="Test"
          src={src}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: `${width} / ${height}`,
            backgroundColor: '#fff',
          }}
        />

        <span
          className={styles.iconWrapper}
          onClick={e => searchThisPic(e, src)}
          onKeyDown={e => searchThisPic(e, src)}
          role="button"
          tabIndex="-1"
        >
          <img src="/images/demos/search-black.svg" alt="search-icon" />
        </span>
      </div>
      {isSelected ? (
        <div className={styles.textWrapper}>
          <p>Similarity Metirc:</p>
          <h5>{distance}</h5>
        </div>
      ) : null}
    </div>
  );
};

export default Item;
